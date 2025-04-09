/**
 * @copyright nhcarrigan
 * @license Naomi's Public License
 * @author Naomi Carrigan
 */
/* eslint-disable @typescript-eslint/naming-convention  -- snake_case matches the YAML standard, I believe?*/

interface Employment {
  title:            string;
  company:          string;
  type:             string;
  start_date:       string;
  end_date:         string;
  description:      string;
  prior_positions?: Array<{
    title:      string;
    start_date: string;
    end_date:   string;
  }>;
}

interface Volunteer {
  title:       string;
  company:     string;
  start_date:  string;
  end_date:    string;
  description: string;
}

interface Education {
  title:       string;
  institution: string;
  type:        string;
  start_date:  string;
  end_date:    string;
  description: string;
}

interface Certification {
  title:  string;
  issuer: string;
  date:   string;
}

interface Project {
  title:       string;
  company:     string;
  description: string;
  date:        string;
}

interface Publication {
  title:       string;
  company:     string;
  description: string;
  date:        string;
}

export interface Resume {
  name:           string;
  contact:        string;
  summary:        string;
  employment:     Array<Employment>;
  volunteer:      Array<Volunteer>;
  education:      Array<Education>;
  certifications: Array<Certification>;
  projects:       Array<Project>;
  publications:   Array<Publication>;
}
