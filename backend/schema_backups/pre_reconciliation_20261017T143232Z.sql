-- CIS CWIE HUB schema-only pre-reconciliation snapshot
-- UTC: 20261017T143232Z
-- alembic_version: 31837ced408a
-- Contains no table row data or credentials.

CREATE SEQUENCE public."documents_id_seq" AS integer START WITH 1 INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 NO CYCLE;
CREATE SEQUENCE public."otp_codes_id_seq" AS integer START WITH 1 INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 NO CYCLE;
CREATE SEQUENCE public."students_id_seq" AS integer START WITH 1 INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 NO CYCLE;
CREATE SEQUENCE public."teachers_id_seq" AS integer START WITH 1 INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 NO CYCLE;

CREATE TABLE public.alembic_version (
	version_num VARCHAR(32) NOT NULL, 
	CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num)
);

CREATE TABLE public.companies (
	company_name VARCHAR NOT NULL, 
	email VARCHAR, 
	phone VARCHAR, 
	address VARCHAR, 
	company_id UUID NOT NULL, 
	province VARCHAR, 
	website VARCHAR, 
	is_active BOOLEAN DEFAULT true NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	industry VARCHAR, 
	description TEXT, 
	logo_url VARCHAR, 
	CONSTRAINT companies_pkey PRIMARY KEY (company_id)
);

CREATE TABLE public.otp_codes (
	id SERIAL NOT NULL, 
	email VARCHAR NOT NULL, 
	otp_hash VARCHAR NOT NULL, 
	expired_at TIMESTAMP WITH TIME ZONE NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now(), 
	role VARCHAR NOT NULL, 
	CONSTRAINT otp_codes_pkey PRIMARY KEY (id)
);

CREATE TABLE public.teachers (
	id SERIAL NOT NULL, 
	email VARCHAR(255) NOT NULL, 
	first_name VARCHAR(100) NOT NULL, 
	last_name VARCHAR(100) NOT NULL, 
	teacher_code VARCHAR, 
	department VARCHAR, 
	is_active BOOLEAN, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now(), 
	updated_at TIMESTAMP WITH TIME ZONE, 
	CONSTRAINT teachers_pkey PRIMARY KEY (id)
);

CREATE TABLE public.users (
	user_id UUID DEFAULT gen_random_uuid() NOT NULL, 
	email VARCHAR(255) NOT NULL, 
	role VARCHAR(20) NOT NULL, 
	is_active BOOLEAN NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE, 
	status VARCHAR(20) DEFAULT 'pending'::character varying NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE, 
	CONSTRAINT users_pkey PRIMARY KEY (user_id)
);

CREATE TABLE public.advisors (
	advisor_id UUID DEFAULT gen_random_uuid() NOT NULL, 
	user_id UUID NOT NULL, 
	first_name VARCHAR(100) NOT NULL, 
	last_name VARCHAR(100) NOT NULL, 
	department VARCHAR(150), 
	phone VARCHAR(30), 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now(), 
	updated_at TIMESTAMP WITH TIME ZONE, 
	CONSTRAINT advisors_pkey PRIMARY KEY (advisor_id), 
	CONSTRAINT advisors_user_id_fkey FOREIGN KEY(user_id) REFERENCES public.users (user_id), 
	CONSTRAINT advisors_user_id_key UNIQUE NULLS DISTINCT (user_id)
);

CREATE TABLE public.mentors (
	mentor_id UUID DEFAULT gen_random_uuid() NOT NULL, 
	user_id UUID NOT NULL, 
	first_name VARCHAR(100) NOT NULL, 
	last_name VARCHAR(100) NOT NULL, 
	phone VARCHAR(30), 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now(), 
	updated_at TIMESTAMP WITH TIME ZONE, 
	CONSTRAINT mentors_pkey PRIMARY KEY (mentor_id), 
	CONSTRAINT mentors_user_id_fkey FOREIGN KEY(user_id) REFERENCES public.users (user_id), 
	CONSTRAINT mentors_user_id_key UNIQUE NULLS DISTINCT (user_id)
);

CREATE TABLE public.positions (
	position_id UUID NOT NULL, 
	company_id UUID NOT NULL, 
	position_name VARCHAR NOT NULL, 
	description TEXT, 
	project_topic TEXT, 
	capacity INTEGER, 
	start_date DATE, 
	end_date DATE, 
	status VARCHAR NOT NULL, 
	requirements JSONB, 
	salary NUMERIC(10, 2), 
	CONSTRAINT positions_pkey PRIMARY KEY (position_id), 
	CONSTRAINT positions_company_id_fkey FOREIGN KEY(company_id) REFERENCES public.companies (company_id)
);

CREATE TABLE public.staffs (
	staff_id UUID DEFAULT gen_random_uuid() NOT NULL, 
	user_id UUID, 
	first_name VARCHAR(100) NOT NULL, 
	last_name VARCHAR(100) NOT NULL, 
	department VARCHAR(150), 
	phone VARCHAR(30), 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now(), 
	updated_at TIMESTAMP WITH TIME ZONE, 
	CONSTRAINT staffs_pkey PRIMARY KEY (staff_id), 
	CONSTRAINT staffs_user_id_fkey FOREIGN KEY(user_id) REFERENCES public.users (user_id), 
	CONSTRAINT staffs_user_id_key UNIQUE NULLS DISTINCT (user_id)
);

CREATE TABLE public.students (
	id SERIAL NOT NULL, 
	student_id VARCHAR, 
	email VARCHAR(255) NOT NULL, 
	first_name VARCHAR(100) NOT NULL, 
	last_name VARCHAR(100) NOT NULL, 
	major VARCHAR, 
	year INTEGER, 
	gpax DOUBLE PRECISION, 
	company_id UUID, 
	is_active BOOLEAN, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now(), 
	updated_at TIMESTAMP WITH TIME ZONE, 
	user_id UUID, 
	phone VARCHAR(30), 
	CONSTRAINT students_pkey PRIMARY KEY (id), 
	CONSTRAINT students_company_id_fkey FOREIGN KEY(company_id) REFERENCES public.companies (company_id), 
	CONSTRAINT students_user_id_fkey FOREIGN KEY(user_id) REFERENCES public.users (user_id), 
	CONSTRAINT students_student_id_key UNIQUE NULLS DISTINCT (student_id), 
	CONSTRAINT students_user_id_key UNIQUE NULLS DISTINCT (user_id)
);

CREATE TABLE public.documents (
	id SERIAL NOT NULL, 
	document_type VARCHAR, 
	file_url VARCHAR, 
	status VARCHAR, 
	student_id INTEGER NOT NULL, 
	comments TEXT, 
	uploaded_at TIMESTAMP WITHOUT TIME ZONE, 
	updated_at TIMESTAMP WITHOUT TIME ZONE, 
	CONSTRAINT documents_pkey PRIMARY KEY (id), 
	CONSTRAINT documents_student_id_fkey FOREIGN KEY(student_id) REFERENCES public.students (id)
);

CREATE TABLE public.student_applications (
	application_id UUID DEFAULT gen_random_uuid() NOT NULL, 
	student_id INTEGER NOT NULL, 
	position_id UUID NOT NULL, 
	status VARCHAR(30) DEFAULT 'applied'::character varying NOT NULL, 
	interview_at TIMESTAMP WITH TIME ZONE, 
	interview_channel VARCHAR(20), 
	interview_location VARCHAR, 
	interview_details TEXT, 
	interview_attended BOOLEAN, 
	interview_completed_at TIMESTAMP WITH TIME ZONE, 
	rejection_reason TEXT, 
	outcome_recorded_by UUID, 
	outcome_recorded_at TIMESTAMP WITH TIME ZONE, 
	applied_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	CONSTRAINT student_applications_pkey PRIMARY KEY (application_id), 
	CONSTRAINT student_applications_outcome_recorded_by_fkey FOREIGN KEY(outcome_recorded_by) REFERENCES public.staffs (staff_id), 
	CONSTRAINT student_applications_position_id_fkey FOREIGN KEY(position_id) REFERENCES public.positions (position_id), 
	CONSTRAINT student_applications_student_id_fkey FOREIGN KEY(student_id) REFERENCES public.students (id), 
	CONSTRAINT uq_student_applications_identity UNIQUE NULLS DISTINCT (application_id, student_id, position_id), 
	CONSTRAINT ck_student_applications_status CHECK (status::text = ANY (ARRAY['applied'::character varying, 'interview_scheduled'::character varying, 'waiting_result'::character varying, 'accepted'::character varying, 'rejected'::character varying]::text[]))
);

CREATE TABLE public.internships (
	internship_id UUID DEFAULT gen_random_uuid() NOT NULL, 
	application_id UUID NOT NULL, 
	student_id INTEGER NOT NULL, 
	position_id UUID NOT NULL, 
	status VARCHAR(20) DEFAULT 'placed'::character varying NOT NULL, 
	start_date DATE, 
	end_date DATE, 
	placed_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	closed_at TIMESTAMP WITH TIME ZONE, 
	closed_by_staff_id UUID, 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL, 
	CONSTRAINT internships_pkey PRIMARY KEY (internship_id), 
	CONSTRAINT fk_internships_matching_application FOREIGN KEY(application_id, student_id, position_id) REFERENCES public.student_applications (application_id, student_id, position_id), 
	CONSTRAINT internships_closed_by_staff_id_fkey FOREIGN KEY(closed_by_staff_id) REFERENCES public.staffs (staff_id), 
	CONSTRAINT internships_position_id_fkey FOREIGN KEY(position_id) REFERENCES public.positions (position_id), 
	CONSTRAINT internships_student_id_fkey FOREIGN KEY(student_id) REFERENCES public.students (id), 
	CONSTRAINT uq_internships_application_id UNIQUE NULLS DISTINCT (application_id), 
	CONSTRAINT uq_internships_student_id UNIQUE NULLS DISTINCT (student_id), 
	CONSTRAINT ck_internships_closure_metadata CHECK (status::text = 'placed'::text AND closed_at IS NULL AND closed_by_staff_id IS NULL OR status::text = 'closed'::text AND closed_at IS NOT NULL AND closed_by_staff_id IS NOT NULL), 
	CONSTRAINT ck_internships_date_range CHECK (start_date IS NULL OR end_date IS NULL OR end_date >= start_date), 
	CONSTRAINT ck_internships_status CHECK (status::text = ANY (ARRAY['placed'::character varying, 'closed'::character varying]::text[]))
);

CREATE INDEX ix_otp_codes_email ON public.otp_codes (email);
CREATE INDEX ix_otp_codes_id ON public.otp_codes (id);
CREATE UNIQUE INDEX ix_teachers_email ON public.teachers (email);
CREATE UNIQUE INDEX ix_users_email ON public.users (email);
CREATE INDEX ix_positions_company_id ON public.positions (company_id);
CREATE UNIQUE INDEX ix_students_email ON public.students (email);
CREATE UNIQUE INDEX uq_documents_one_resume_per_student ON public.documents (student_id) WHERE (lower((document_type)::text) = 'resume'::text);
CREATE INDEX ix_student_applications_position_id ON public.student_applications (position_id);
CREATE INDEX ix_student_applications_status ON public.student_applications (status);
CREATE INDEX ix_student_applications_student_id ON public.student_applications (student_id);
CREATE UNIQUE INDEX uq_student_applications_one_active_per_student ON public.student_applications (student_id) WHERE ((status)::text = ANY ((ARRAY['applied'::character varying, 'interview_scheduled'::character varying, 'waiting_result'::character varying])::text[]));

-- Catalog index definitions (verification/reference):
-- CREATE UNIQUE INDEX advisors_pkey ON public.advisors USING btree (advisor_id);
-- CREATE UNIQUE INDEX advisors_user_id_key ON public.advisors USING btree (user_id);
-- CREATE UNIQUE INDEX alembic_version_pkc ON public.alembic_version USING btree (version_num);
-- CREATE UNIQUE INDEX companies_pkey ON public.companies USING btree (company_id);
-- CREATE UNIQUE INDEX documents_pkey ON public.documents USING btree (id);
-- CREATE UNIQUE INDEX uq_documents_one_resume_per_student ON public.documents USING btree (student_id) WHERE (lower((document_type)::text) = 'resume'::text);
-- CREATE UNIQUE INDEX internships_pkey ON public.internships USING btree (internship_id);
-- CREATE UNIQUE INDEX uq_internships_application_id ON public.internships USING btree (application_id);
-- CREATE UNIQUE INDEX uq_internships_student_id ON public.internships USING btree (student_id);
-- CREATE UNIQUE INDEX mentors_pkey ON public.mentors USING btree (mentor_id);
-- CREATE UNIQUE INDEX mentors_user_id_key ON public.mentors USING btree (user_id);
-- CREATE INDEX ix_otp_codes_email ON public.otp_codes USING btree (email);
-- CREATE INDEX ix_otp_codes_id ON public.otp_codes USING btree (id);
-- CREATE UNIQUE INDEX otp_codes_pkey ON public.otp_codes USING btree (id);
-- CREATE INDEX ix_positions_company_id ON public.positions USING btree (company_id);
-- CREATE UNIQUE INDEX positions_pkey ON public.positions USING btree (position_id);
-- CREATE UNIQUE INDEX staffs_pkey ON public.staffs USING btree (staff_id);
-- CREATE UNIQUE INDEX staffs_user_id_key ON public.staffs USING btree (user_id);
-- CREATE INDEX ix_student_applications_position_id ON public.student_applications USING btree (position_id);
-- CREATE INDEX ix_student_applications_status ON public.student_applications USING btree (status);
-- CREATE INDEX ix_student_applications_student_id ON public.student_applications USING btree (student_id);
-- CREATE UNIQUE INDEX student_applications_pkey ON public.student_applications USING btree (application_id);
-- CREATE UNIQUE INDEX uq_student_applications_identity ON public.student_applications USING btree (application_id, student_id, position_id);
-- CREATE UNIQUE INDEX uq_student_applications_one_active_per_student ON public.student_applications USING btree (student_id) WHERE ((status)::text = ANY ((ARRAY['applied'::character varying, 'interview_scheduled'::character varying, 'waiting_result'::character varying])::text[]));
-- CREATE UNIQUE INDEX ix_students_email ON public.students USING btree (email);
-- CREATE UNIQUE INDEX students_pkey ON public.students USING btree (id);
-- CREATE UNIQUE INDEX students_student_id_key ON public.students USING btree (student_id);
-- CREATE UNIQUE INDEX students_user_id_key ON public.students USING btree (user_id);
-- CREATE UNIQUE INDEX ix_teachers_email ON public.teachers USING btree (email);
-- CREATE UNIQUE INDEX teachers_pkey ON public.teachers USING btree (id);
-- CREATE UNIQUE INDEX ix_users_email ON public.users USING btree (email);
-- CREATE UNIQUE INDEX users_pkey ON public.users USING btree (user_id);
-- RLS policies (verification/reference):
