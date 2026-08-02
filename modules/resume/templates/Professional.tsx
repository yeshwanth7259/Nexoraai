import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { ResumeData } from '../types';

// Register fonts
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2' },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hiA.woff2', fontWeight: 700 }
  ]
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Inter',
    fontSize: 10,
    color: '#333',
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 20,
    borderBottom: '2px solid #2563eb',
    paddingBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    color: '#2563eb',
    marginBottom: 8,
  },
  contactInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    color: '#64748b',
    fontSize: 9,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e293b',
    borderBottom: '1px solid #cbd5e1',
    paddingBottom: 4,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  summary: {
    marginBottom: 10,
  },
  job: {
    marginBottom: 10,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  role: {
    fontWeight: 'bold',
    color: '#1e293b',
  },
  company: {
    color: '#475569',
    fontStyle: 'italic',
  },
  duration: {
    color: '#64748b',
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 2,
    paddingLeft: 10,
  },
  bullet: {
    width: 10,
  },
  educationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  degree: {
    fontWeight: 'bold',
  },
  skillsCategory: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  skillsList: {
    marginBottom: 6,
  }
});

interface Props {
  data: ResumeData;
}

export const ProfessionalTemplate = ({ data }: Props) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.personalInfo.name}</Text>
          <Text style={styles.title}>{data.personalInfo.title}</Text>
          <View style={styles.contactInfo}>
            <Text>{data.personalInfo.email}</Text>
            <Text>•</Text>
            <Text>{data.personalInfo.phone}</Text>
            <Text>•</Text>
            <Text>{data.personalInfo.location}</Text>
            {data.personalInfo.links.map((link, i) => (
              <React.Fragment key={i}>
                <Text>•</Text>
                <Text>{link}</Text>
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Summary</Text>
          <Text style={styles.summary}>{data.summary}</Text>
        </View>

        {/* Experience */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experience</Text>
          {data.experience.map((job, idx) => (
            <View key={idx} style={styles.job}>
              <View style={styles.jobHeader}>
                <View>
                  <Text style={styles.role}>{job.role}</Text>
                  <Text style={styles.company}>{job.company}</Text>
                </View>
                <Text style={styles.duration}>{job.duration}</Text>
              </View>
              {job.description.map((desc, dIdx) => (
                <View key={dIdx} style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text>{desc}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {data.projects.map((proj, idx) => (
              <View key={idx} style={styles.job}>
                <View style={styles.jobHeader}>
                  <Text style={styles.role}>{proj.name}</Text>
                </View>
                <Text style={styles.summary}>{proj.description}</Text>
                <Text style={styles.skillsList}><Text style={{fontWeight: 'bold'}}>Tech Stack: </Text>{proj.technologies.join(', ')}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Technical Skills</Text>
          {data.skills.map((skill, idx) => (
            <View key={idx} style={{ flexDirection: 'row', marginBottom: 2 }}>
              <Text style={{ fontWeight: 'bold', width: 100 }}>{skill.category}:</Text>
              <Text style={{ flex: 1 }}>{skill.items.join(', ')}</Text>
            </View>
          ))}
        </View>

        {/* Education */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {data.education.map((edu, idx) => (
            <View key={idx} style={styles.educationItem}>
              <View>
                <Text style={styles.degree}>{edu.degree}</Text>
                <Text style={styles.company}>{edu.school}</Text>
              </View>
              <Text style={styles.duration}>{edu.year}</Text>
            </View>
          ))}
        </View>

      </Page>
    </Document>
  );
};
