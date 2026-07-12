import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

// TIPE DATA - IKUTIN STRUKTUR KAMU
export interface PluralSifatMusyabihat {  
  mufrodMuannas: string; 
  jamakTaksir: string; 
  katsroh?: string;
  muntahal: string;  
  isQiyasi: boolean; 
  isSamai: boolean; 
  reference: string; 
  explanation: string;
  wazanName?: string;
}

type TasrifLughowi = {
  madi: string[];     // 14
  mudhari: string[];  // 14
  isimFail?: string[]; // 6 - BARU
  isimMaful?: string[]; // 6 - BARU
  amr: string[];      // 12
  nahi: string[];     // 12
}

type TasrifIstilahiData = {
  fiilMadi: string[];
  fiilMudhari: string[];
  masdar: string[];        // 1-5
  masdarLain?: string[];   // BARU
  masdarSamai?: string[];
  masdarMarrah?: string[];
  masdarNau?: string[];
  isimFail: string[];      // 1
  isimMaful: string[];     // 1
  sifatMusyabihat?: string[]; // BARU
  fiilAmar: string[];
  fiilNahi: string[];
  isimZaman: string;
  isimMakan: string;
  isimAlat: string;
  isimTashgir: string;
}

type JamakData = {
  isimFail: { qillah?: string; katsroh?: string; muntahal?: string };
  isimMaful: { qillah?: string; katsroh?: string; muntahal?: string };
  zaman: { qillah?: string; katsroh?: string; muntahal?: string };
  makan: { qillah?: string; katsroh?: string; muntahal?: string };
  alat: { qillah?: string; katsroh?: string; muntahal?: string };
  sifatMusyabihat: PluralSifatMusyabihat;
}

type Props = {
  lughowi: TasrifLughowi;
  istilahi: TasrifIstilahiData;
  jamak: JamakData;
  font: string;
}

export const TasrifTable = ({ lughowi, istilahi, jamak, font }: Props) => {
  const [activeTab, setActiveTab] = useState<'madi' | 'mudhari' | 'isimFail' | 'isimMaful' | 'amr' | 'nahi'>('madi');

  const s = jamak.sifatMusyabihat;
  const jenis = `${s?.isQiyasi ? 'Qiyasi' : ''} ${s?.isSamai ? 'Sama\'i' : ''}`.trim() || '-';

  // Lughowi List Data Generator
  const getLughowiList = () => {
    const madiDhamir = [
      { dhamir: "هُوَ", arti: "Dia (L Tunggal)", person: "3rd Person Male (Singular)" },
      { dhamir: "هُمَا", arti: "Mereka Berdua (L)", person: "3rd Person Male (Dual)" },
      { dhamir: "هُمْ", arti: "Mereka (L Banyak)", person: "3rd Person Male (Plural)" },
      { dhamir: "هِيَ", arti: "Dia (P Tunggal)", person: "3rd Person Female (Singular)" },
      { dhamir: "هُمَا", arti: "Mereka Berdua (P)", person: "3rd Person Female (Dual)" },
      { dhamir: "هُنَّ", arti: "Mereka (P Banyak)", person: "3rd Person Female (Plural)" },
      { dhamir: "أَنْتَ", arti: "Kamu (L Tunggal)", person: "2nd Person Male (Singular)" },
      { dhamir: "أَنْتُمَا", arti: "Kamu Berdua (L)", person: "2nd Person Male (Dual)" },
      { dhamir: "أَنْتُمْ", arti: "Kamu (L Banyak)", person: "2nd Person Male (Plural)" },
      { dhamir: "أَنْتِ", arti: "Kamu (P Tunggal)", person: "2nd Person Female (Singular)" },
      { dhamir: "أَنْتُمَا", arti: "Kamu Berdua (P)", person: "2nd Person Female (Dual)" },
      { dhamir: "أَنْتُنَّ", arti: "Kamu (P Banyak)", person: "2nd Person Female (Plural)" },
      { dhamir: "أَنَا", arti: "Saya", person: "1st Person (Singular)" },
      { dhamir: "نَحْنُ", arti: "Kami / Kita", person: "1st Person (Plural)" }
    ];

    const amrDhamir = [
      { dhamir: "هُوَ (لِـ)", arti: "Hendaklah dia (L Tunggal)", person: "Imperative 3rd Person Male (Singular)" },
      { dhamir: "هُمَا (لِـ)", arti: "Hendaklah mereka berdua (L)", person: "Imperative 3rd Person Male (Dual)" },
      { dhamir: "هُمْ (لِـ)", arti: "Hendaklah mereka (L Banyak)", person: "Imperative 3rd Person Male (Plural)" },
      { dhamir: "هِيَ (لِـ)", arti: "Hendaklah dia (P Tunggal)", person: "Imperative 3rd Person Female (Singular)" },
      { dhamir: "هُمَا (لِـ)", arti: "Hendaklah mereka berdua (P)", person: "Imperative 3rd Person Female (Dual)" },
      { dhamir: "هُنَّ (لِـ)", arti: "Hendaklah mereka (P Banyak)", person: "Imperative 3rd Person Female (Plural)" },
      { dhamir: "أَنْتَ", arti: "Lakukanlah kamu! (L)", person: "Imperative 2nd Person Male (Singular)" },
      { dhamir: "أَنْتُمَا", arti: "Lakukanlah kamu berdua! (L)", person: "Imperative 2nd Person Male (Dual)" },
      { dhamir: "أَنْتُمْ", arti: "Lakukanlah kamu banyak! (L)", person: "Imperative 2nd Person Male (Plural)" },
      { dhamir: "أَنْتِ", arti: "Lakukanlah kamu! (P)", person: "Imperative 2nd Person Female (Singular)" },
      { dhamir: "أَنْتُمَا", arti: "Lakukanlah kamu berdua! (P)", person: "Imperative 2nd Person Female (Dual)" },
      { dhamir: "أَنْتُنَّ", arti: "Lakukanlah kamu banyak! (P)", person: "Imperative 2nd Person Female (Plural)" }
    ];

    const isim6Dhamir = [
      { dhamir: "مُفْرَد مُذَكَّر", arti: "Tunggal (Laki-laki)", person: "Singular Masculine" },
      { dhamir: "تَثْنِيَة مُذَكَّر", arti: "Ganda (Laki-laki)", person: "Dual Masculine" },
      { dhamir: "جَمْع مُذَكَّر", arti: "Jamak (Laki-laki)", person: "Plural Masculine" },
      { dhamir: "مُفْرَد مُؤَنَّث", arti: "Tunggal (Perempuan)", person: "Singular Feminine" },
      { dhamir: "تَثْنِيَة مُؤَنَّث", arti: "Ganda (Perempuan)", person: "Dual Feminine" },
      { dhamir: "جَمْع مُؤَنَّث", arti: "Jamak (Perempuan)", person: "Plural Feminine" }
    ];

    switch (activeTab) {
      case 'madi':
        return madiDhamir.map((d, i) => ({ ...d, kata: lughowi.madi[i] }));
      case 'mudhari':
        return madiDhamir.map((d, i) => ({ ...d, kata: lughowi.mudhari[i] }));
      case 'amr':
        return amrDhamir.map((d, i) => ({ ...d, kata: lughowi.amr[i] }));
      case 'nahi':
        return amrDhamir.map((d, i) => ({ ...d, kata: lughowi.nahi[i] }));
      case 'isimFail':
        return isim6Dhamir.map((d, i) => ({ ...d, kata: lughowi.isimFail?.[i] }));
      case 'isimMaful':
        return isim6Dhamir.map((d, i) => ({ ...d, kata: lughowi.isimMaful?.[i] }));
      default:
        return [];
    }
  };

  const istilahiItems = [
    { label: "Fi'il Madhi", value: istilahi.fiilMadi[0], desc: "Masa Lampau" },
    { label: "Fi'il Mudhari", value: istilahi.fiilMudhari[0], desc: "Masa Kini/Nanti" },
    { label: 'Masdar', value: istilahi.masdar[0], desc: "Kata Benda" },
    { label: "Isim Fa'il", value: istilahi.isimFail[0], desc: "Pelaku" },
    { label: "Isim Maf'ul", value: istilahi.isimMaful[0], desc: "Penderita" },
    ...(istilahi.sifatMusyabihat?.[0] && istilahi.sifatMusyabihat[0] !== '-' ? [{ label: "Sifat Musyabahah", value: istilahi.sifatMusyabihat[0], desc: "Sifat Menetap" }] : []),
    { label: "Fi'il Amar", value: istilahi.fiilAmar[0], desc: "Kata Perintah" },
    { label: "Fi'il Nahi", value: istilahi.fiilNahi[0], desc: "Kata Larangan" },
    { label: 'Isim Zaman', value: istilahi.isimZaman, desc: "Keterangan Waktu" },
    { label: 'Isim Makan', value: istilahi.isimMakan, desc: "Keterangan Tempat" },
    { label: 'Isim Alat', value: istilahi.isimAlat, desc: "Alat" },
    { label: 'Isim Tashghir', value: istilahi.isimTashgir, desc: "Pengecilan Arti" }
  ];

  const tabs = [
    { id: 'madi', label: 'Madhi' },
    { id: 'mudhari', label: 'Mudhari' },
    { id: 'isimFail', label: "Isim Fa'il" },
    { id: 'isimMaful', label: "Isim Maf'ul" },
    { id: 'amr', label: 'Amar' },
    { id: 'nahi', label: 'Nahi' },
  ];

  return (
    <View style={styles.container}>
      
      {/* 1. TASHRIF ISTILAHI (ROW CARDS WITH HORIZONTAL SCROLL) */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { fontFamily: font }]}>Tasrif Istilahi</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.istilahiScrollContainer}>
        {istilahiItems.map((item, idx) => (
          <View key={idx} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardLabel}>{item.label}</Text>
              <Text style={styles.cardDesc}>{item.desc}</Text>
            </View>
            <Text style={[styles.cardArabic, { fontFamily: font }]} dir="rtl">{item.value || '—'}</Text>
            <Text style={styles.cardIndex}>Shighah {idx + 1}</Text>
          </View>
        ))}
      </ScrollView>

      {/* 2. TASHRIF LUGHOWI (LIST VIEW WITH TABS) */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { fontFamily: font }]}>Tasrif Lughowi</Text>
      </View>
      
      {/* TABS SELECTOR */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => setActiveTab(tab.id as any)}
            style={[styles.tabButton, activeTab === tab.id && styles.tabButtonActive]}
          >
            <Text style={[styles.tabButtonText, activeTab === tab.id && styles.tabButtonTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* LUGHOWI VERTICAL LIST */}
      <View style={styles.listContainer}>
        {getLughowiList().map((item, idx) => (
          <View key={idx} style={styles.listItem}>
            <View style={styles.listItemLeft}>
              <View style={styles.dhamirBadge}>
                <Text style={styles.dhamirBadgeText}>{item.dhamir}</Text>
              </View>
              <View style={styles.listItemDetails}>
                <Text style={styles.listItemArti}>{item.arti}</Text>
                <Text style={styles.listItemPerson}>{item.person}</Text>
              </View>
            </View>
            <Text style={[styles.listItemArabic, { fontFamily: font }]} dir="rtl">{item.kata || '—'}</Text>
          </View>
        ))}
      </View>

      {/* 3. JAMAK */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { fontFamily: font }]}>Jamak & Sifat Musyabahah</Text>
      </View>

      <View style={styles.jamakGrid}>
        {[
          { label: "Jamak Isim Fa'il", ...jamak.isimFail },
          { label: "Jamak Isim Maf'ul", ...jamak.isimMaful },
          { label: "Jamak Isim Zaman", ...jamak.zaman },
          { label: "Jamak Isim Makan", ...jamak.makan },
          { label: "Jamak Isim Alat", ...jamak.alat },
        ].map((item, idx) => (
          <View key={idx} style={styles.jamakItem}>
            <Text style={styles.jamakItemLabel}>{item.label}</Text>
            <View style={styles.jamakRow}>
              <Text style={styles.jamakLabelSub}>Qillah:</Text>
              <Text style={[styles.jamakVal, { fontFamily: font }]}>{item.qillah || '—'}</Text>
            </View>
            <View style={styles.jamakRow}>
              <Text style={styles.jamakLabelSub}>Katsrah:</Text>
              <Text style={[styles.jamakVal, { fontFamily: font }]}>{item.katsroh || '—'}</Text>
            </View>
            <View style={styles.jamakRow}>
              <Text style={styles.jamakLabelSub}>Muntahal:</Text>
              <Text style={[styles.jamakVal, { fontFamily: font }]}>{item.muntahal || '—'}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* SIFAT MUSYABAHAH DETAILS */}
      <View style={styles.sifatContainer}>
        <Text style={styles.sifatTitle}>Sifat Musyabahah</Text>
        
        <View style={styles.sifatDetailRow}>
          <Text style={styles.sifatDetailLabel}>Wazan Mufrod</Text>
          <Text style={[styles.sifatDetailVal, { fontFamily: font }]}>{s?.wazanName || '(-)'}</Text>
        </View>
        <View style={styles.sifatDetailRow}>
          <Text style={styles.sifatDetailLabel}>Mufrod Muannas</Text>
          <Text style={[styles.sifatDetailVal, { fontFamily: font }]}>{s?.mufrodMuannas || '-'}</Text>
        </View>
        <View style={styles.sifatDetailRow}>
          <Text style={styles.sifatDetailLabel}>Jamak Taksir</Text>
          <Text style={[styles.sifatDetailVal, { fontFamily: font }]}>{s?.jamakTaksir || s?.katsroh || '-'}</Text>
        </View>
        <View style={styles.sifatDetailRow}>
          <Text style={styles.sifatDetailLabel}>Muntahal Jumu'</Text>
          <Text style={[styles.sifatDetailVal, { fontFamily: font }]}>{s?.muntahal || '-'}</Text>
        </View>
        <View style={styles.sifatDetailRow}>
          <Text style={styles.sifatDetailLabel}>Jenis Jamak</Text>
          <Text style={styles.sifatDetailText}>{jenis}</Text>
        </View>
      </View>

      {/* ( Masdar ) DETAILS */}
      {((istilahi.masdarSamai && istilahi.masdarSamai.length > 0) ||
        (istilahi.masdarMarrah && istilahi.masdarMarrah.length > 0) ||
        (istilahi.masdarNau && istilahi.masdarNau.length > 0)) && (
        <View style={[styles.sifatContainer, { marginTop: 15 }]}>
          <Text style={styles.sifatTitle}>( Masdar )</Text>
          
          <View style={styles.sifatDetailRow}>
            <Text style={styles.sifatDetailLabel}>(masdar sama'i)</Text>
            <Text style={[styles.sifatDetailVal, { fontFamily: font }]}>
              {istilahi.masdarSamai && istilahi.masdarSamai.length > 0 ? istilahi.masdarSamai.join(" / ") : '—'}
            </Text>
          </View>
          <View style={styles.sifatDetailRow}>
            <Text style={styles.sifatDetailLabel}>(Masdar marrah)</Text>
            <Text style={[styles.sifatDetailVal, { fontFamily: font }]}>
              {istilahi.masdarMarrah && istilahi.masdarMarrah.length > 0 ? istilahi.masdarMarrah.join(" / ") : '—'}
            </Text>
          </View>
          <View style={styles.sifatDetailRow}>
            <Text style={styles.sifatDetailLabel}>(Masdar nau')</Text>
            <Text style={[styles.sifatDetailVal, { fontFamily: font }]}>
              {istilahi.masdarNau && istilahi.masdarNau.length > 0 ? istilahi.masdarNau.join(" / ") : '—'}
            </Text>
          </View>
        </View>
      )}
      </View>

  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  istilahiScrollContainer: {
    paddingLeft: 16,
    paddingRight: 8,
    paddingVertical: 12,
  },
  card: {
    width: 170,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    padding: 14,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4f46e5',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardDesc: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 2,
  },
  cardArabic: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0f172a',
    marginVertical: 6,
    textAlign: 'center',
  },
  cardIndex: {
    fontSize: 10,
    color: '#4f46e5',
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    fontWeight: '600',
    overflow: 'hidden',
  },
  tabsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    marginRight: 8,
  },
  tabButtonActive: {
    backgroundColor: '#4f46e5',
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  tabButtonTextActive: {
    color: '#ffffff',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
  },
  listItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dhamirBadge: {
    backgroundColor: '#e0e7ff',
    borderWidth: 1,
    borderColor: '#c7d2fe',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 44,
  },
  dhamirBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#4f46e5',
  },
  listItemDetails: {
    marginLeft: 12,
    flex: 1,
  },
  listItemArti: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#334155',
  },
  listItemPerson: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 2,
  },
  listItemArabic: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'right',
  },
  jamakGrid: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  jamakItem: {
    width: '48%',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  jamakItemLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#475569',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
    paddingBottom: 4,
  },
  jamakRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 2,
  },
  jamakLabelSub: {
    fontSize: 10,
    color: '#64748b',
  },
  jamakVal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  sifatContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 16,
  },
  sifatTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
    paddingBottom: 6,
  },
  sifatDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  sifatDetailLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  sifatDetailVal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  sifatDetailText: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '500',
  },
});
