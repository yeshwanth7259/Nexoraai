import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { ResumeData } from '../types';



const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#111827',
    lineHeight: 1.6,
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  name: {
    fontSize: 28,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  title: {
    fontSize: 12,
    color: '#4b5563',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  contactInfo: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 9,
    lineHeight: 1.4,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  summary: {
    marginBottom: 10,
    color: '#374151',
  },
  job: {
    marginBottom: 12,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  role: {
    fontWeight: 'bold',
    fontSize: 11,
  },
  company: {
    color: '#4b5563',
  },
  duration: {
    color: '#6b7280',
    fontSize: 9,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 3,
    paddingLeft: 10,
  },
  bullet: {
    width: 10,
    color: '#9ca3af',
  },
  descText: {
    flex: 1,
    color: '#374151',
  },
  skillCategory: {
    fontWeight: 'bold',
    width: 120,
  },
  skillRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  educationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  degree: {
    fontWeight: 'bold',
  },
});

interface Props {
  data: ResumeData;
}

export const MinimalTemplate = ({ data }: Props) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{data?.personalInfo?.name || 'Name'}</Text>
          <Text style={styles.title}>{data?.personalInfo?.title || 'Title'}</Text>
          <View>
            <Text style={styles.contactInfo}>
              {[
                data?.personalInfo?.email,
                data?.personalInfo?.phone,
                data?.personalInfo?.location,
                ...(data?.personalInfo?.links || [])
              ].filter(Boolean).join('   |   ')}
            </Text>
          </View>
        </View>

        {/* Summary */}
        <View style={styles.section}>
          <Text style={styles.summary}>{data?.summary || ''}</Text>
        </View>

        {/* Experience */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experience</Text>
          {(data?.experience || []).map((job, idx) => (
            <View key={idx} style={styles.job}>
              <View style={styles.jobHeader}>
                <View>
                  <Text style={styles.role}>{job?.role || ''}</Text>
                  <Text style={styles.company}>{job?.company || ''}</Text>
                </View>
                <Text style={styles.duration}>{job?.duration || ''}</Text>
              </View>
              {(job?.description || []).map((desc, dIdx) => (
                <View key={dIdx} style={styles.bulletPoint}>
                  <Text style={styles.bullet}>-</Text>
                  <Text style={styles.descText}>{desc || ''}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* Projects */}
        {data?.projects && data.projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {data.projects.map((proj, idx) => (
              <View key={idx} style={styles.job}>
                <View style={styles.jobHeader}>
                  <Text style={styles.role}>{proj?.name || ''}</Text>
                </View>
                <Text style={styles.summary}>{proj?.description || ''}</Text>
                <Text style={{ fontSize: 9, color: '#6b7280' }}>{(proj?.technologies || []).join(', ')}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {(data?.education || []).map((edu, idx) => (
            <View key={idx} style={styles.educationItem}>
              <View>
                <Text style={styles.degree}>{edu?.degree || ''}</Text>
                <Text style={styles.company}>{edu?.school || ''}</Text>
              </View>
              <Text style={styles.duration}>{edu?.year || ''}</Text>
            </View>
          ))}
        </View>

        {/* Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          {(data?.skills || []).map((skill, idx) => (
            <View key={idx} style={styles.skillRow}>
              <Text style={styles.skillCategory}>{skill?.category || ''}</Text>
              <Text style={{ flex: 1, color: '#4b5563' }}>{(skill?.items || []).join(', ')}</Text>
            </View>
          ))}
        </View>

      </Page>
    </Document>
  );
};
