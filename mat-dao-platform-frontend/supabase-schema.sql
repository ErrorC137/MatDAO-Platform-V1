-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('researcher', 'staff', 'investor')),
  wallet_address TEXT UNIQUE,
  university TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  researcher_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  trl INTEGER NOT NULL CHECK (trl >= 1 AND trl <= 9),
  phase TEXT NOT NULL,
  funding_goal INTEGER NOT NULL,
  funding_raised INTEGER DEFAULT 0,
  description JSONB NOT NULL DEFAULT '[]',
  technical_specs JSONB NOT NULL DEFAULT '[]',
  market_applications JSONB NOT NULL DEFAULT '[]',
  development_timeline JSONB NOT NULL DEFAULT '[]',
  team JSONB NOT NULL DEFAULT '[]',
  risk_factors JSONB NOT NULL DEFAULT '[]',
  competitive_advantage JSONB NOT NULL DEFAULT '[]',
  ip_status JSONB NOT NULL DEFAULT '{"type": "", "status": "", "details": ""}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create assessments table
CREATE TABLE IF NOT EXISTS assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  category TEXT NOT NULL,
  trl INTEGER NOT NULL,
  ip_score INTEGER NOT NULL,
  valuation_usd INTEGER,
  due_diligence_score INTEGER,
  investment_tier TEXT,
  trl_project JSONB,
  ip_report JSONB,
  due_diligence_report JSONB,
  summary JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create verification_tasks table
CREATE TABLE IF NOT EXISTS verification_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  milestone_name TEXT NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  project_title TEXT NOT NULL,
  proof_text TEXT NOT NULL,
  submitted_by TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ai_passed BOOLEAN DEFAULT false,
  ai_plagiarism_score INTEGER DEFAULT 0,
  ai_consistency_report TEXT,
  human_voted BOOLEAN DEFAULT false,
  human_passed BOOLEAN,
  human_notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected', 'flagged')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create submitted_milestones table
CREATE TABLE IF NOT EXISTS submitted_milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  project_title TEXT NOT NULL,
  milestone_key TEXT NOT NULL,
  milestone_label TEXT NOT NULL,
  description TEXT NOT NULL,
  timeline TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'future' CHECK (status IN ('completed', 'current', 'future')),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  submitted_by TEXT NOT NULL,
  verification_id UUID REFERENCES verification_tasks(id) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_projects_researcher ON projects(researcher_id);
CREATE INDEX IF NOT EXISTS idx_projects_trl ON projects(trl);
CREATE INDEX IF NOT EXISTS idx_assessments_user ON assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_project ON assessments(project_id);
CREATE INDEX IF NOT EXISTS idx_verification_tasks_project ON verification_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_verification_tasks_status ON verification_tasks(status);
CREATE INDEX IF NOT EXISTS idx_submitted_milestones_user ON submitted_milestones(user_id);
CREATE INDEX IF NOT EXISTS idx_submitted_milestones_project ON submitted_milestones(project_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE submitted_milestones ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Staff can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'staff'
    )
  );

-- RLS Policies for projects
CREATE POLICY "Everyone can view projects" ON projects
  FOR SELECT USING (true);

CREATE POLICY "Researchers can create projects" ON projects
  FOR INSERT WITH CHECK (
    auth.uid() = researcher_id AND
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'researcher'
    )
  );

CREATE POLICY "Researchers can update their own projects" ON projects
  FOR UPDATE USING (
    researcher_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'researcher'
    )
  );

CREATE POLICY "Staff can update any project" ON projects
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'staff'
    )
  );

-- RLS Policies for assessments
CREATE POLICY "Users can view their own assessments" ON assessments
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own assessments" ON assessments
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Staff can view all assessments" ON assessments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'staff'
    )
  );

-- RLS Policies for verification_tasks
CREATE POLICY "Researchers can view their own verification tasks" ON verification_tasks
  FOR SELECT USING (
    submitted_by IN (
      SELECT name FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Researchers can create verification tasks" ON verification_tasks
  FOR INSERT WITH CHECK (
    submitted_by IN (
      SELECT name FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Researchers can update their pending verification tasks" ON verification_tasks
  FOR UPDATE USING (
    submitted_by IN (
      SELECT name FROM profiles WHERE id = auth.uid()
    ) AND status = 'pending'
  );

CREATE POLICY "Staff can view all verification tasks" ON verification_tasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'staff'
    )
  );

CREATE POLICY "Staff can update verification tasks" ON verification_tasks
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'staff'
    )
  );

-- RLS Policies for submitted_milestones
CREATE POLICY "Users can view their own submitted milestones" ON submitted_milestones
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create submitted milestones" ON submitted_milestones
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own submitted milestones" ON submitted_milestones
  FOR UPDATE USING (user_id = auth.uid());

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
