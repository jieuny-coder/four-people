// PDF_form.js
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import NotoSansKR from '../fonts/NotoSansKR-Regular.ttf'; // 한글 폰트 파일 경로

// 폰트 등록
Font.register({
  family: 'NotoSansKR',
  src: NotoSansKR,
});

// 날짜 포맷 함수
const formatDate = (isoString) => {
  if (!isoString) return '날짜 없음';
  const date = new Date(isoString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'NotoSansKR',
  },
  header: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCol: {
    width: '20%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
  },
  tableCell: {
    margin: 5,
    fontSize: 10,
  },
});

const PDF_form = ({ data }) => {
  // 로그 추가: PDF_form에 전달된 data를 확인
  console.log('PDF_form에 전달된 data:', data);

  // 예외 처리: 데이터가 비어 있을 경우
  if (!data || data.length === 0) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text style={styles.header}>위반 차량 내역</Text>
          <Text>표시할 데이터가 없습니다.</Text>
        </Page>
      </Document>
    );
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>위반 차량 내역</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            {['날짜', '차량번호', '장소', '주차시간', '이용구역'].map((header, index) => (
              <View key={index} style={styles.tableCol}>
                <Text style={styles.tableCell}>{header}</Text>
              </View>
            ))}
          </View>
          {data.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{formatDate(item.violation_date)}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{item.violation_number}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{item.violation_location}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{item.violation_time}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{item.violation_section}</Text></View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default PDF_form;
