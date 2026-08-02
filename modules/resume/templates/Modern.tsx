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
    padding: 0,
    fontFamily: 'Inter',
    fontSize: 10,
    color: '#333',
    lineHeight: 1.5,
    flexDirection: 'row',
  },
  leftColumn: {
    width: '35%',
    backgroundColor: '#1e293b',
    color: '#f8fafc',
    padding: 30,
    height: '100%',
  },
  rightColumn: {
    width: '65%',
    padding: 30,
    backgroundColor: '#ffffff',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  title: {
    fontSize: 12,
    color: '#38bdf8',
    marginBottom: 20,
  },
  contactItem: {
    marginBottom: 8,
    fontSize: 9,
    color: '#cbd5e1',
  },
  leftSectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#38bdf8',
    marginTop: 20,
    marginBottom: 10,
    textTransform: 'uppercase',
    borderBottom: '1px solid #334155',
    paddingBottom: 4,
  },
  rightSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
    borderBottom: '2px solid #e2e8f0',
    paddingBottom: 4,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  summary: {
    marginBottom: 15,
    color: '#475569',
  },
  job: {
    marginBottom: 12,
  },
  jobHeader: {
    marginBottom: 4,
  },
  role: {
    fontWeight: 'bold',
    color: '#0f172a',
    fontSize: 11,
  },
  company: {
    color: '#3b82f6',
    fontWeight: 'bold',
  },
  duration: {
    color: '#64748b',
    fontSize: 9,
    marginBottom: 4,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 3,
    paddingLeft: 10,
  },
  bullet: {
    width: 10,
    color: '#94a3b8',
  },
  skillCategory: {
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 2,
    fontSize: 10,
  },
  skillItems: {
    color: '#94a3b8',
    marginBottom: 8,
    fontSize: 9,
  },
  educationItem: {
    marginBottom: 10,
  },
  degree: {
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  school: {
    color: '#cbd5e1',
    fontSize: 9,
  },
});

interface Props {
  data: ResumeData;
}

export const ModernTemplate = ({ data }: Props) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* LEFT COLUMN */}
        <View style={styles.leftColumn}>
          <Text style={styles.name}>{data.personalInfo.name}</Text>
          <Text style={styles.title}>{data.personalInfo.title}</Text>
          
          <View style={{ marginTop: 10 }}>
            <Text style={styles.contactItem}>{data.personalInfo.email}</Text>
            <Text style={styles.contactItem}>{data.personalInfo.phone}</Text>
            <Text style={styles.contactItem}>{data.personalInfo.location}</Text>
            {data.personalInfo.links.map((link, i) => (
              <Text key={i} style={styles.contactItem}>{link}</Text>
            ))}
          </View>

          <Text style={styles.leftSectionTitle}>Skills</Text>
          {data.skills.map((skill, idx) => (
            <View key={idx}>
              <Text style={styles.skillCategory}>{skill.category}</Text>
              <Text style={styles.skillItems}>{skill.items.join(', ')}</Text>
            </View>
          ))}

          <Text style={styles.leftSectionTitle}>Education</Text>
          {data.education.map((edu, idx) => (
            <View key={idx} style={styles.educationItem}>
              <Text style={styles.degree}>{edu.degree}</Text>
              <Text style={styles.school}>{edu.school}</Text>
              <Text style={styles.school}>{edu.year}</Text>
            </View>
          ))}
        </View>

        {/* RIGHT COLUMN */}
        <View style={styles.rightColumn}>
          <Text style={styles.rightSectionTitle}>Profile</Text>
          <Text style={styles.summary}>{data.summary}</Text>

          <Text style={styles.rightSectionTitle}>Experience</Text>
          {data.experience.map((job, idx) => (
            <View key={idx} style={styles.job}>
              <View style={styles.jobHeader}>
                <Text style={styles.role}>{job.role}</Text>
                <Text style={styles.company}>{job.company}</Text>
                <Text style={styles.duration}>{job.duration}</Text>
              </View>
              {job.description.map((desc, dIdx) => (
                <View key={dIdx} style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={{ flex: 1, color: '#475569' }}>{desc}</Text>
                </View>
              ))}
            </View>
          ))}

          {data.projects && data.projects.length > 0 && (
            <View>
              <Text style={styles.rightSectionTitle}>Projects</Text>
              {data.projects.map((proj, idx) => (
                <View key={idx} style={styles.job}>
                  <Text style={styles.role}>{proj.name}</Text>
                  <Text style={{ color: '#475569', marginBottom: 4 }}>{proj.description}</Text>
                  <Text style={{ fontSize: 9, color: '#64748b' }}>Tech Stack: {proj.technologies.join(', ')}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

      </Page>
    </Document>
  );
};
