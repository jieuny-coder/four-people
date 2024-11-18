import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import NotoSansKR from '../fonts/NotoSansKR-Regular.ttf';

// 폰트 등록
Font.register({
  family: 'NotoSansKR',
  src: NotoSansKR,
  fontStyle: 'normal',
  fontWeight: 'normal',
});

// PDF 스타일 정의
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: 'NotoSansKR',
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  table: {
    display: 'table',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderStyle: 'solid',
  },
  cell: {
    flex: 1,
    padding: 5,
    textAlign: 'center',
    borderRightWidth: 1,
    borderStyle: 'solid',
  },
  cellHeader: {
    flex: 1,
    padding: 5,
    textAlign: 'center',
    fontWeight: 'bold',
    backgroundColor: '#f2f2f2',
  },
});

const Obstacle_pdf_from = ({ obstacle }) => {
  if (!obstacle) {
    return (
      <Document>
        <Page style={styles.page}>
          <Text>적재물 데이터가 없습니다.</Text>
        </Page>
      </Document>
    );
  }

  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.title}>적재물 내역</Text>
        <View style={styles.table}>
          {/* 테이블 헤더 */}
          <View style={styles.row}>
            <Text style={styles.cellHeader}>ID</Text>
            <Text style={styles.cellHeader}>설명</Text>
            <Text style={styles.cellHeader}>탐지 시간</Text>
          </View>
          {/* 테이블 데이터 */}
          <View style={styles.row}>
            <Text style={styles.cell}>{obstacle.id}</Text>
            <Text style={styles.cell}>{obstacle.description}</Text>
            <Text style={styles.cell}>
              {new Date(obstacle.detected_at).toLocaleString('ko-KR')}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default Obstacle_pdf_from;
