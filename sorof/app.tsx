import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { useFonts } from 'expo-font';
import { IilalEngine } from './utils/Engine';
import { TasrifTable } from './components/TabelTasrifView';
import { DataWazan, DictionaryEntry, JamakData } from './type/type';
import { PRESET_DICTIONARY } from './data';

const hijaiyahOrder = ["أ", "ا", "ب", "ت", "ث", "ج", "ح", "خ", "د", "ذ", "ر", "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ع", "غ", "ف", "ق", "ك", "ل", "م", "ن", "هـ", "ه", "و", "ي"];

const sortedPresets = [...PRESET_DICTIONARY].sort((a, b) => {
  const getIndex = (char: string) => {
    const idx = hijaiyahOrder.indexOf(char);
    return idx === -1 ? 999 : idx;
  };
  const fA = getIndex(a.root.fa);
  const fB = getIndex(b.root.fa);
  if (fA !== fB) return fA - fB;

  const aA = getIndex(a.root.ain);
  const aB = getIndex(b.root.ain);
  if (aA !== aB) return aA - aB;

  const lA = getIndex(a.root.lam);
  const lB = getIndex(b.root.lam);
  return lA - lB;
});

const cleanVal = (val: string | undefined): string | null => {
  if (!val) return null;
  const trimmed = val.trim();
  if (trimmed === '' || trimmed === '-' || trimmed === '—' || trimmed === '-.') return null;
  return trimmed;
};

export default function App() {
  const [fa, setFa] = useState('ن');
  const [ain, setAin] = useState('ص');
  const [lam, setLam] = useState('ر');
  const [bab, setBab] = useState('1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHijaiyahLetter, setSelectedHijaiyahLetter] = useState<string | null>(null);
  const [isHijaiyahPopupOpen, setIsHijaiyahPopupOpen] = useState(false);
  const [groupingMode, setGroupingMode] = useState<'bab' | 'hijaiyah' | 'bina'>('bab');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'bab_1': true,
    'bina_Shohih': true,
  });

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }));
  };

  const letterCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    sortedPresets.forEach(item => {
      counts[item.root.fa] = (counts[item.root.fa] || 0) + 1;
    });
    return counts;
  }, []);

  type LocalResultType = {
    lughowi: { 
      madi: string[]; 
      mudhari: string[]; 
      amr: string[]; 
      nahi: string[];
      isimFail?: string[];
      isimMaful?: string[];
    };
    istilahi: {
      fiilMadi: string[];
      fiilMudhari: string[];
      masdar: string[];
      masdarLain?: string[];
      masdarSamai?: string[];
      masdarMarrah?: string[];
      masdarNau?: string[];
      isimFail: string[];
      isimMaful: string[];
      sifatMusyabihat?: string[];
      fiilAmar: string[];
      fiilNahi: string[];
      isimZaman: string;
      isimMakan: string;
      isimAlat: string;
      isimTashgir: string;
    };
    jamak: JamakData;
  };

  const [result, setResult] = useState<LocalResultType | null>(null);

  const [fontsLoaded] = useFonts({ 'Amiri': require('./assets/fonts/Amiri-Regular.ttf') });

  const cariDiKamus = (fa: string, ain: string, lam: string): DictionaryEntry | undefined => {
    return sortedPresets.find(
      item => item.root.fa === fa && item.root.ain === ain && item.root.lam === lam && item.babNum === Number(bab)
    );
  }

  const handleTasrif = () => {
    if(!fa ||!ain ||!lam) {
      setError('Harap isi ف ع ل semua');
      return;
    }
    setError('');
    setLoading(true);

    setTimeout(() => {
      const dataKamus = cariDiKamus(fa, ain, lam);
      const dataWazan: DataWazan = { fa, ain, lam, babNum: Number(bab) };

      const hasilTasrif = IilalEngine.tasrifLengkap(dataWazan, dataKamus?.sifatMusyabihat || "—");
      
      const mappedLughowi = {
        madi: hasilTasrif.lughowi.madhi14,
        mudhari: hasilTasrif.lughowi.mudhari14,
        amr: hasilTasrif.lughowi.amar12,
        nahi: hasilTasrif.lughowi.nahi12,
        isimFail: hasilTasrif.lughowi.isimFail6,
        isimMaful: hasilTasrif.lughowi.isimMaful6,
      };

      const binaVal = IilalEngine.detectBina(fa, ain, lam);
      const processValue = (val: string | undefined): string | null => {
        const cleaned = cleanVal(val);
        if (!cleaned) return null;
        return IilalEngine.postProcessWord(cleaned, binaVal, fa, ain, lam);
      };

      const masdarSamaiVal = [
        ...(dataKamus?.masdarSamai ? [processValue(dataKamus.masdarSamai) || ""] : [])
      ].filter(Boolean);
      const masdarMarrahVal = (hasilTasrif.istilahi.marrah && hasilTasrif.istilahi.marrah !== "—" && hasilTasrif.istilahi.marrah !== "-") ? [hasilTasrif.istilahi.marrah] : [];
      const masdarNauVal = (hasilTasrif.istilahi.nau && hasilTasrif.istilahi.nau !== "—" && hasilTasrif.istilahi.nau !== "-") ? [hasilTasrif.istilahi.nau] : [];
      const masdarLainVal = [
        ...masdarSamaiVal,
        ...masdarMarrahVal.map(m => `${m} (Marrah)`),
        ...masdarNauVal.map(n => `${n} (Nau)`)
      ];
      const masdarQiyasiVal = processValue(dataKamus?.masdarQiyasi) || hasilTasrif.istilahi.masdar;

      let sifatMusyabihatVal = hasilTasrif.sifat;
      if (dataKamus) {
        const hasCustomPlural = !!(processValue(dataKamus.sifatMusyabihatPlural?.mufrod_muannas) || processValue(dataKamus.sifatMusyabihatPlural?.katsroh) || processValue(dataKamus.sifatMusyabihatPlural?.muntahal));
        sifatMusyabihatVal = {
          mufrodMudzakkar: processValue(dataKamus.sifatMusyabihat) || processValue(dataKamus.sifatMusyabihatPlural?.mufrod_mudzakkar) || hasilTasrif.sifat.mufrodMudzakkar,
          mufrodMuannas: processValue(dataKamus.sifatMusyabihatPlural?.mufrod_muannas) || hasilTasrif.sifat.mufrodMuannas,
          jamakTaksir: processValue(dataKamus.sifatMusyabihatPlural?.katsroh) || hasilTasrif.sifat.jamakTaksir || hasilTasrif.sifat.katsroh,
          muntahal: processValue(dataKamus.sifatMusyabihatPlural?.muntahal) || hasilTasrif.sifat.muntahal,
          isQiyasi: hasCustomPlural ? true : hasilTasrif.sifat.isQiyasi,
          isSamai: hasCustomPlural ? false : hasilTasrif.sifat.isSamai,
          reference: (processValue(dataKamus.sifatMusyabihat) || hasCustomPlural) ? "Kamus Preset" : hasilTasrif.sifat.reference,
          explanation: (processValue(dataKamus.sifatMusyabihat) || hasCustomPlural) ? `Sifat Musyabahah dari kamus preset (Arti: ${dataKamus.translation})` : hasilTasrif.sifat.explanation,
          wazanName: hasilTasrif.sifat.wazanName
        };
      }

      const detectedWazanSifatVal = IilalEngine.detectWazanSifat(sifatMusyabihatVal.mufrodMudzakkar);
      sifatMusyabihatVal.wazanName = (detectedWazanSifatVal === "—" || !detectedWazanSifatVal) ? "(-)" : detectedWazanSifatVal;

      const isLughowiBab5 = Number(bab) === 5;
      const mappedIstilahi = {
        fiilMadi: [hasilTasrif.istilahi.madhi],
        fiilMudhari: [hasilTasrif.istilahi.mudhari],
        masdar: [masdarQiyasiVal],
        masdarLain: masdarLainVal,
        masdarSamai: masdarSamaiVal,
        masdarMarrah: masdarMarrahVal,
        masdarNau: masdarNauVal,
        isimFail: [hasilTasrif.lughowi.isimFail6[0]],
        isimMaful: isLughowiBab5 ? ["-"] : [hasilTasrif.lughowi.isimMaful6[0]],
        sifatMusyabihat: [sifatMusyabihatVal.mufrodMudzakkar],
        fiilAmar: [hasilTasrif.istilahi.amar],
        fiilNahi: [hasilTasrif.istilahi.nahi],
        isimZaman: hasilTasrif.istilahi.isimZaman.mufrod,
        isimMakan: hasilTasrif.istilahi.isimMakan.mufrod,
        isimAlat: hasilTasrif.istilahi.isimAlat.mufrod,
        isimTashgir: hasilTasrif.istilahi.isimTashghir,
      };

      const mappedJamak: JamakData = {
        isimFail: {
          qillah: hasilTasrif.jamak.fail.qillah,
          katsroh: hasilTasrif.jamak.fail.katsroh,
          muntahal: hasilTasrif.jamak.fail.muntahal
        },
        isimMaful: {
          qillah: hasilTasrif.jamak.maful.qillah,
          katsroh: hasilTasrif.jamak.maful.katsroh,
          muntahal: hasilTasrif.jamak.maful.muntahal
        },
        zaman: {
          qillah: hasilTasrif.jamak.zaman.qillah,
          katsroh: hasilTasrif.jamak.zaman.katsroh,
          muntahal: hasilTasrif.jamak.zaman.muntahal
        },
        makan: {
          qillah: hasilTasrif.jamak.zaman.qillah,
          katsroh: hasilTasrif.jamak.zaman.katsroh,
          muntahal: hasilTasrif.jamak.zaman.muntahal
        },
        alat: {
          qillah: hasilTasrif.jamak.alat.qillah,
          katsroh: hasilTasrif.jamak.alat.katsroh,
          muntahal: hasilTasrif.jamak.alat.muntahal
        },
        sifatMusyabihat: sifatMusyabihatVal
      };

      setResult({
        lughowi: mappedLughowi,
        istilahi: mappedIstilahi,
        jamak: mappedJamak
      });
      setLoading(false);
    }, 100);
  };

  const selectPreset = (item: DictionaryEntry) => {
    setFa(item.root.fa);
    setAin(item.root.ain);
    setLam(item.root.lam);
    setBab(item.babNum.toString());

    setLoading(true);
    setError('');
    setTimeout(() => {
      const dataWazan: DataWazan = { fa: item.root.fa, ain: item.root.ain, lam: item.root.lam, babNum: item.babNum };
      const hasilTasrif = IilalEngine.tasrifLengkap(dataWazan, item.sifatMusyabihat || "—");

      const mappedLughowi = {
        madi: hasilTasrif.lughowi.madhi14,
        mudhari: hasilTasrif.lughowi.mudhari14,
        amr: hasilTasrif.lughowi.amar12,
        nahi: hasilTasrif.lughowi.nahi12,
        isimFail: hasilTasrif.lughowi.isimFail6,
        isimMaful: hasilTasrif.lughowi.isimMaful6,
      };

      const masdarSamaiVal = [
        ...(item.masdarSamai ? [item.masdarSamai] : [])
      ].filter(Boolean);
      const masdarMarrahVal = (hasilTasrif.istilahi.marrah && hasilTasrif.istilahi.marrah !== "—" && hasilTasrif.istilahi.marrah !== "-") ? [hasilTasrif.istilahi.marrah] : [];
      const masdarNauVal = (hasilTasrif.istilahi.nau && hasilTasrif.istilahi.nau !== "—" && hasilTasrif.istilahi.nau !== "-") ? [hasilTasrif.istilahi.nau] : [];
      const masdarLainVal = [
        ...masdarSamaiVal,
        ...masdarMarrahVal.map(m => `${m} (Marrah)`),
        ...masdarNauVal.map(n => `${n} (Nau)`)
      ];
      const masdarQiyasiVal = item.masdarQiyasi || hasilTasrif.istilahi.masdar;

      const hasCustomPlural = !!(cleanVal(item.sifatMusyabihatPlural?.mufrod_muannas) || cleanVal(item.sifatMusyabihatPlural?.katsroh) || cleanVal(item.sifatMusyabihatPlural?.muntahal));
      const sifatMusyabihatVal = {
        mufrodMudzakkar: cleanVal(item.sifatMusyabihat) || cleanVal(item.sifatMusyabihatPlural?.mufrod_mudzakkar) || hasilTasrif.sifat.mufrodMudzakkar,
        mufrodMuannas: cleanVal(item.sifatMusyabihatPlural?.mufrod_muannas) || hasilTasrif.sifat.mufrodMuannas,
        jamakTaksir: cleanVal(item.sifatMusyabihatPlural?.katsroh) || hasilTasrif.sifat.jamakTaksir || hasilTasrif.sifat.katsroh,
        muntahal: cleanVal(item.sifatMusyabihatPlural?.muntahal) || hasilTasrif.sifat.muntahal,
        isQiyasi: hasCustomPlural ? true : hasilTasrif.sifat.isQiyasi,
        isSamai: hasCustomPlural ? false : hasilTasrif.sifat.isSamai,
        reference: (cleanVal(item.sifatMusyabihat) || hasCustomPlural) ? "Kamus Preset" : hasilTasrif.sifat.reference,
        explanation: (cleanVal(item.sifatMusyabihat) || hasCustomPlural) ? `Sifat Musyabahah dari kamus preset (Arti: ${item.translation})` : hasilTasrif.sifat.explanation,
        wazanName: hasilTasrif.sifat.wazanName
      };

      const detectedWazanSifatVal = IilalEngine.detectWazanSifat(sifatMusyabihatVal.mufrodMudzakkar);
      sifatMusyabihatVal.wazanName = (detectedWazanSifatVal === "—" || !detectedWazanSifatVal) ? "(-)" : detectedWazanSifatVal;

      const isLughowiBab5 = item.babNum === 5;
      const mappedIstilahi = {
        fiilMadi: [hasilTasrif.istilahi.madhi],
        fiilMudhari: [hasilTasrif.istilahi.mudhari],
        masdar: [masdarQiyasiVal],
        masdarLain: masdarLainVal,
        masdarSamai: masdarSamaiVal,
        masdarMarrah: masdarMarrahVal,
        masdarNau: masdarNauVal,
        isimFail: [hasilTasrif.lughowi.isimFail6[0]],
        isimMaful: isLughowiBab5 ? ["-"] : [hasilTasrif.lughowi.isimMaful6[0]],
        sifatMusyabihat: [sifatMusyabihatVal.mufrodMudzakkar],
        fiilAmar: [hasilTasrif.istilahi.amar],
        fiilNahi: [hasilTasrif.istilahi.nahi],
        isimZaman: hasilTasrif.istilahi.isimZaman.mufrod,
        isimMakan: hasilTasrif.istilahi.isimMakan.mufrod,
        isimAlat: hasilTasrif.istilahi.isimAlat.mufrod,
        isimTashgir: hasilTasrif.istilahi.isimTashghir,
      };

      const mappedJamak: JamakData = {
        isimFail: {
          qillah: hasilTasrif.jamak.fail.qillah,
          katsroh: hasilTasrif.jamak.fail.katsroh,
          muntahal: hasilTasrif.jamak.fail.muntahal
        },
        isimMaful: {
          qillah: hasilTasrif.jamak.maful.qillah,
          katsroh: hasilTasrif.jamak.maful.katsroh,
          muntahal: hasilTasrif.jamak.maful.muntahal
        },
        zaman: {
          qillah: hasilTasrif.jamak.zaman.qillah,
          katsroh: hasilTasrif.jamak.zaman.katsroh,
          muntahal: hasilTasrif.jamak.zaman.muntahal
        },
        makan: {
          qillah: hasilTasrif.jamak.zaman.qillah,
          katsroh: hasilTasrif.jamak.zaman.katsroh,
          muntahal: hasilTasrif.jamak.zaman.muntahal
        },
        alat: {
          qillah: hasilTasrif.jamak.alat.qillah,
          katsroh: hasilTasrif.jamak.alat.katsroh,
          muntahal: hasilTasrif.jamak.alat.muntahal
        },
        sifatMusyabihat: sifatMusyabihatVal
      };

      setResult({
        lughowi: mappedLughowi,
        istilahi: mappedIstilahi,
        jamak: mappedJamak
      });
      setLoading(false);
    }, 100);
  };

  useEffect(() => {
    if (sortedPresets.length > 0) {
      selectPreset(sortedPresets[0]);
    }
  }, []);

  if (!fontsLoaded) return <ActivityIndicator size="large" style={{flex:1, justifyContent:'center'}} />;

  const bina = IilalEngine.detectBina(fa, ain, lam);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios'? 'padding' : 'height'} style={{flex: 1}}>
        <ScrollView contentContainerStyle={{paddingBottom: 40}}>

          {/* HEADER APP */}
          <View style={styles.appHeader}>
            <Text style={[styles.appTitle, {fontFamily: 'Amiri'}]}>Alat Tasrif</Text>
            <Text style={[styles.appSubtitle, {fontFamily: 'Amiri'}]}>Tasrif Lughowi 14 / 12 + Istilahi + Jamak</Text>
          </View>

          {/* PRESETS SEARCH CARD */}
          <View style={styles.card}>
            <Text style={[styles.cardTitle, {fontFamily: 'Amiri'}]}>Kamus Kata Preset ({sortedPresets.length})</Text>
            
            <TextInput
              style={[styles.searchInput, {fontFamily: 'Amiri'}]}
              placeholder="Cari arab, makna, bina..."
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholderTextColor="#94a3b8"
            />

            {/* HIJAIYAH GROUP CATEGORY SELECTOR BUTTONS */}
            <View style={styles.categoryRow}>
              <TouchableOpacity
                onPress={() => setIsHijaiyahPopupOpen(true)}
                style={[
                  styles.categoryBtn,
                  selectedHijaiyahLetter ? styles.categoryBtnActive : styles.categoryBtnNormal
                ]}
              >
                <Text style={[
                  styles.categoryBtnText,
                  selectedHijaiyahLetter ? styles.categoryBtnTextActive : styles.categoryBtnTextNormal
                ]}>
                  Kelompok: {selectedHijaiyahLetter ? `Huruf "${selectedHijaiyahLetter}"` : 'Semua Huruf'}
                </Text>
                <Text style={styles.categoryChevron}>▼</Text>
              </TouchableOpacity>

              {selectedHijaiyahLetter ? (
                <TouchableOpacity
                  onPress={() => setSelectedHijaiyahLetter(null)}
                  style={styles.categoryClearBtn}
                >
                  <Text style={styles.categoryClearText}>✕</Text>
                </TouchableOpacity>
              ) : null}
            </View>

            {/* GROUPING MODE TOGGLE */}
            <View style={{ flexDirection: 'row', backgroundColor: '#f1f5f9', padding: 4, borderRadius: 10, marginBottom: 12 }}>
              <TouchableOpacity
                onPress={() => setGroupingMode('bab')}
                style={{ flex: 1, paddingVertical: 6, borderRadius: 8, alignItems: 'center', backgroundColor: groupingMode === 'bab' ? '#ffffff' : 'transparent', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: groupingMode === 'bab' ? 0.1 : 0, shadowRadius: 1, elevation: groupingMode === 'bab' ? 1 : 0 }}
              >
                <Text style={{ fontSize: 12, fontWeight: '700', color: groupingMode === 'bab' ? '#4f46e5' : '#64748b' }}>Kelompok Bab</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setGroupingMode('bina')}
                style={{ flex: 1, paddingVertical: 6, borderRadius: 8, alignItems: 'center', backgroundColor: groupingMode === 'bina' ? '#ffffff' : 'transparent', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: groupingMode === 'bina' ? 0.1 : 0, shadowRadius: 1, elevation: groupingMode === 'bina' ? 1 : 0 }}
              >
                <Text style={{ fontSize: 12, fontWeight: '700', color: groupingMode === 'bina' ? '#4f46e5' : '#64748b' }}>Kelompok Bina</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setGroupingMode('hijaiyah')}
                style={{ flex: 1, paddingVertical: 6, borderRadius: 8, alignItems: 'center', backgroundColor: groupingMode === 'hijaiyah' ? '#ffffff' : 'transparent', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: groupingMode === 'hijaiyah' ? 0.1 : 0, shadowRadius: 1, elevation: groupingMode === 'hijaiyah' ? 1 : 0 }}
              >
                <Text style={{ fontSize: 12, fontWeight: '700', color: groupingMode === 'hijaiyah' ? '#4f46e5' : '#64748b' }}>Kelompok Hijaiyah</Text>
              </TouchableOpacity>
            </View>

            <View style={{ maxHeight: 280 }}>
              <ScrollView nestedScrollEnabled={true}>
                {(() => {
                  const filteredPresets = sortedPresets.filter(item => {
                    if (selectedHijaiyahLetter && item.root.fa !== selectedHijaiyahLetter) {
                      return false;
                    }
                    if (!searchTerm) return true;
                    const term = searchTerm.toLowerCase();
                    const rootStr = `${item.root.fa} ${item.root.ain} ${item.root.lam}`.toLowerCase();
                    const rootCombined = `${item.root.fa}${item.root.ain}${item.root.lam}`.toLowerCase();
                    const translation = (item.translation || '').toLowerCase();
                    const binaCalculated = IilalEngine.detectBina(item.root.fa, item.root.ain, item.root.lam).toLowerCase();
                    const id = (item.id || '').toLowerCase();
                    return rootStr.includes(term) || rootCombined.includes(term) || translation.includes(term) || binaCalculated.includes(term) || id.includes(term);
                  });

                  if (groupingMode === 'bab') {
                    return [1, 2, 3, 4, 5, 6].map(b => {
                      const items = filteredPresets.filter(item => item.babNum === b);
                      if (items.length === 0) return null;
                      const groupKey = `bab_${b}`;
                      const isExpanded = !!expandedGroups[groupKey];
                      return (
                        <View key={groupKey} style={{ borderWidth: 1, borderColor: '#f1f5f9', borderRadius: 10, marginVertical: 4, overflow: 'hidden', backgroundColor: '#fafafa' }}>
                          <TouchableOpacity
                            onPress={() => toggleGroup(groupKey)}
                            style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, backgroundColor: '#f1f5f9' }}
                          >
                            <Text style={{ fontSize: 12, fontWeight: '700', color: '#334155' }}>Bab {b} ({items.length} Kata)</Text>
                            <Text style={{ fontSize: 10, color: '#64748b' }}>{isExpanded ? '▲' : '▼'}</Text>
                          </TouchableOpacity>
                          {isExpanded && (
                            <View style={{ padding: 6, backgroundColor: '#ffffff' }}>
                              {items.map((item, idx) => {
                                const isSelected = fa === item.root.fa && ain === item.root.ain && lam === item.root.lam && Number(bab) === item.babNum;
                                const calculatedBina = IilalEngine.detectBina(item.root.fa, item.root.ain, item.root.lam);
                                return (
                                  <TouchableOpacity
                                    key={item.id || idx}
                                    onPress={() => selectPreset(item)}
                                    style={[styles.presetItem, isSelected && styles.presetItemActive, { marginVertical: 2 }]}
                                  >
                                    <View style={styles.presetLeft}>
                                      <View style={styles.badgeRow}>
                                        <View style={styles.badgeGray}>
                                          <Text style={[styles.badgeTextGray, {fontFamily: 'Amiri'}]}>{calculatedBina}</Text>
                                        </View>
                                      </View>
                                      <Text style={[styles.presetTranslation, {fontFamily: 'Amiri'}]} numberOfLines={1}>
                                        {item.translation}
                                      </Text>
                                    </View>
                                    <View style={styles.presetRight}>
                                      <Text style={[styles.presetRoot, {fontFamily: 'Amiri', fontSize: 14}]}>
                                        {item.root.fa} - {item.root.ain} - {item.root.lam}
                                      </Text>
                                    </View>
                                  </TouchableOpacity>
                                );
                              })}
                            </View>
                          )}
                        </View>
                      );
                    });
                  } else if (groupingMode === 'bina') {
                    const binaOrderedList = ["Shohih", "Mitsal", "Ajwaf", "Naqish", "Mudho'af", "Mahmuz", "Lafif"];
                    return binaOrderedList.map(binaName => {
                      const items = filteredPresets.filter(item => {
                        const b = IilalEngine.detectBina(item.root.fa, item.root.ain, item.root.lam);
                        if (binaName === "Mahmuz") return b.startsWith("Mahmuz");
                        if (binaName === "Lafif") return b.startsWith("Lafif");
                        if (binaName === "Naqish") return b === "Naqis" || b === "Naqish";
                        return b === binaName;
                      });
                      if (items.length === 0) return null;
                      const groupKey = `bina_${binaName.replace(/[\s']+/g, '_')}`;
                      const isExpanded = !!expandedGroups[groupKey];
                      return (
                        <View key={groupKey} style={{ borderWidth: 1, borderColor: '#f1f5f9', borderRadius: 10, marginVertical: 4, overflow: 'hidden', backgroundColor: '#fafafa' }}>
                          <TouchableOpacity
                            onPress={() => toggleGroup(groupKey)}
                            style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, backgroundColor: '#f1f5f9' }}
                          >
                            <Text style={{ fontSize: 12, fontWeight: '700', color: '#334155' }}>Bina {binaName} ({items.length} Kata)</Text>
                            <Text style={{ fontSize: 10, color: '#64748b' }}>{isExpanded ? '▲' : '▼'}</Text>
                          </TouchableOpacity>
                          {isExpanded && (
                            <View style={{ padding: 6, backgroundColor: '#ffffff' }}>
                              {items.map((item, idx) => {
                                const isSelected = fa === item.root.fa && ain === item.root.ain && lam === item.root.lam && Number(bab) === item.babNum;
                                const calculatedBina = IilalEngine.detectBina(item.root.fa, item.root.ain, item.root.lam);
                                return (
                                  <TouchableOpacity
                                    key={item.id || idx}
                                    onPress={() => selectPreset(item)}
                                    style={[styles.presetItem, isSelected && styles.presetItemActive, { marginVertical: 2 }]}
                                  >
                                    <View style={styles.presetLeft}>
                                      <View style={styles.badgeRow}>
                                        <View style={styles.badgeBlue}>
                                          <Text style={[styles.badgeText, {fontFamily: 'Amiri'}]}>Bab {item.babNum}</Text>
                                        </View>
                                        <View style={styles.badgeGray}>
                                          <Text style={[styles.badgeTextGray, {fontFamily: 'Amiri'}]}>{calculatedBina}</Text>
                                        </View>
                                      </View>
                                      <Text style={[styles.presetTranslation, {fontFamily: 'Amiri'}]} numberOfLines={1}>
                                        {item.translation}
                                      </Text>
                                    </View>
                                    <View style={styles.presetRight}>
                                      <Text style={[styles.presetRoot, {fontFamily: 'Amiri', fontSize: 14}]}>
                                        {item.root.fa} - {item.root.ain} - {item.root.lam}
                                      </Text>
                                    </View>
                                  </TouchableOpacity>
                                );
                              })}
                            </View>
                          )}
                        </View>
                      );
                    });
                  } else {
                    return hijaiyahOrder.map(char => {
                      const items = filteredPresets.filter(item => item.root.fa === char);
                      if (items.length === 0) return null;
                      const groupKey = `hijaiyah_${char}`;
                      const isExpanded = !!expandedGroups[groupKey];
                      return (
                        <View key={groupKey} style={{ borderWidth: 1, borderColor: '#f1f5f9', borderRadius: 10, marginVertical: 4, overflow: 'hidden', backgroundColor: '#fafafa' }}>
                          <TouchableOpacity
                            onPress={() => toggleGroup(groupKey)}
                            style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, backgroundColor: '#f1f5f9' }}
                          >
                            <Text style={{ fontSize: 12, fontWeight: '700', color: '#334155' }}>Huruf "{char}" ({items.length} Kata)</Text>
                            <Text style={{ fontSize: 10, color: '#64748b' }}>{isExpanded ? '▲' : '▼'}</Text>
                          </TouchableOpacity>
                          {isExpanded && (
                            <View style={{ padding: 6, backgroundColor: '#ffffff' }}>
                              {items.map((item, idx) => {
                                const isSelected = fa === item.root.fa && ain === item.root.ain && lam === item.root.lam && Number(bab) === item.babNum;
                                const calculatedBina = IilalEngine.detectBina(item.root.fa, item.root.ain, item.root.lam);
                                return (
                                  <TouchableOpacity
                                    key={item.id || idx}
                                    onPress={() => selectPreset(item)}
                                    style={[styles.presetItem, isSelected && styles.presetItemActive, { marginVertical: 2 }]}
                                  >
                                    <View style={styles.presetLeft}>
                                      <View style={styles.badgeRow}>
                                        <View style={styles.badgeBlue}>
                                          <Text style={[styles.badgeText, {fontFamily: 'Amiri'}]}>Bab {item.babNum}</Text>
                                        </View>
                                        <View style={styles.badgeGray}>
                                          <Text style={[styles.badgeTextGray, {fontFamily: 'Amiri'}]}>{calculatedBina}</Text>
                                        </View>
                                      </View>
                                      <Text style={[styles.presetTranslation, {fontFamily: 'Amiri'}]} numberOfLines={1}>
                                        {item.translation}
                                      </Text>
                                    </View>
                                    <View style={styles.presetRight}>
                                      <Text style={[styles.presetRoot, {fontFamily: 'Amiri', fontSize: 14}]}>
                                        {item.root.fa} - {item.root.ain} - {item.root.lam}
                                      </Text>
                                    </View>
                                  </TouchableOpacity>
                                );
                              })}
                            </View>
                          )}
                        </View>
                      );
                    });
                  }
                })()}
              </ScrollView>
            </View>
          </View>

          {/* HASIL */}
          {result && (
            <>
              {/* INFO RINGKAS */}
              <View style={styles.infoCard}>
                <View style={styles.infoItem}>
                  <Text style={[styles.infoLabel, {fontFamily: 'Amiri'}]}>Masdar</Text>
                  <Text style={[styles.infoValue, {fontFamily: 'Amiri'}]}>{result.istilahi.masdar[0]?? '-'}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={[styles.infoLabel, {fontFamily: 'Amiri'}]}>Bina</Text>
                  <Text style={[styles.infoValue, {fontFamily: 'Amiri'}]}>{bina}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={[styles.infoLabel, {fontFamily: 'Amiri'}]}>Bab</Text>
                  <Text style={[styles.infoValue, {fontFamily: 'Amiri'}]}>Bab {bab}</Text>
                </View>
              </View>

              {/* TABEL UTAMA */}
              <TasrifTable
                lughowi={result.lughowi}
                istilahi={result.istilahi}
                jamak={result.jamak}
                font="Amiri"
              />
            </>
          )}

        </ScrollView>
      </KeyboardAvoidingView>

      {/* HIJAIYAH MODAL POPUP */}
      <Modal
        visible={isHijaiyahPopupOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsHijaiyahPopupOpen(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setIsHijaiyahPopupOpen(false)}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pilih Kelompok Hijaiyah (Akar Fa)</Text>
              <TouchableOpacity onPress={() => setIsHijaiyahPopupOpen(false)} style={styles.modalCloseBtn}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalGrid}>
              {hijaiyahOrder.map((char) => {
                const count = letterCounts[char] || 0;
                const hasPresets = count > 0;
                const isSelected = selectedHijaiyahLetter === char;

                return (
                  <TouchableOpacity
                    key={char}
                    disabled={!hasPresets}
                    onPress={() => {
                      setSelectedHijaiyahLetter(char);
                      setIsHijaiyahPopupOpen(false);
                    }}
                    style={[
                      styles.gridItem,
                      !hasPresets && styles.gridItemDisabled,
                      isSelected && styles.gridItemActive
                    ]}
                  >
                    <Text style={[styles.gridChar, isSelected && styles.gridCharActive, !hasPresets && styles.gridCharDisabled]}>{char}</Text>
                    <Text style={[styles.gridCount, isSelected && styles.gridCountActive]}>{count} Kata</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.btnReset}
                onPress={() => {
                  setSelectedHijaiyahLetter(null);
                  setIsHijaiyahPopupOpen(false);
                }}
              >
                <Text style={styles.btnResetText}>Tampilkan Semua ({sortedPresets.length} Kata)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnClose}
                onPress={() => setIsHijaiyahPopupOpen(false)}
              >
                <Text style={styles.btnCloseText}>Tutup</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },

  appHeader: { paddingVertical: 20, alignItems: 'center', backgroundColor: '#2563eb' },
  appTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff', writingDirection: 'rtl' },
  appSubtitle: { fontSize: 14, color: '#dbeafe', marginTop: 4, writingDirection: 'rtl' },

  card: { backgroundColor: '#fff', margin: 12, padding: 16, borderRadius: 16, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 16, writingDirection: 'rtl', color: '#1e293b' },

  button: { backgroundColor: '#2563eb', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  errorText: { color: '#dc2626', textAlign: 'center', marginBottom: 8, fontSize: 14, writingDirection: 'rtl' },

  infoCard: { flexDirection: 'row', backgroundColor: '#fefce8', marginHorizontal: 12, padding: 12, borderRadius: 12, justifyContent: 'space-around', marginBottom: 12, borderWidth: 1, borderColor: '#fde047' },
  infoItem: { alignItems: 'center' },
  infoLabel: { fontSize: 12, color: '#a16207', writingDirection: 'rtl' },
  infoValue: { fontSize: 18, fontWeight: 'bold', color: '#713f12', writingDirection: 'rtl' },

  searchInput: { borderWidth: 1.5, borderColor: '#cbd5e1', borderRadius: 12, paddingHorizontal: 12, height: 45, fontSize: 14, writingDirection: 'rtl', backgroundColor: '#f8fafc', marginBottom: 12, color: '#1e293b' },
  presetList: { maxHeight: 220 },
  presetItem: { padding: 10, borderRadius: 10, borderWidth: 1, borderColor: '#f1f5f9', backgroundColor: '#fafafa', marginVertical: 4, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  presetItemActive: { borderColor: '#2563eb', backgroundColor: '#eff6ff' },
  presetLeft: { flex: 1 },
  badgeRow: { flexDirection: 'row', gap: 4, marginBottom: 4 },
  badgeBlue: { backgroundColor: '#dbeafe', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  badgeText: { fontSize: 10, color: '#1e40af', fontWeight: 'bold' },
  badgeGray: { backgroundColor: '#e2e8f0', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  badgeTextGray: { fontSize: 10, color: '#475569', fontWeight: 'bold' },
  presetTranslation: { fontSize: 11, color: '#475569' },
  presetRight: { alignItems: 'flex-end', marginLeft: 8 },
  presetRoot: { fontSize: 16, fontWeight: 'bold', color: '#0f172a', writingDirection: 'rtl' },
  presetMasdar: { fontSize: 10, color: '#047857', fontWeight: 'bold', marginTop: 2, writingDirection: 'rtl' },

  categoryRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  categoryBtn: { flex: 1, height: 42, borderRadius: 12, paddingHorizontal: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1 },
  categoryBtnNormal: { backgroundColor: '#f8fafc', borderColor: '#e2e8f0' },
  categoryBtnActive: { backgroundColor: '#eff6ff', borderColor: '#bfdbfe' },
  categoryBtnText: { fontSize: 13, fontWeight: '600' },
  categoryBtnTextNormal: { color: '#475569' },
  categoryBtnTextActive: { color: '#1d4ed8' },
  categoryChevron: { fontSize: 10, color: '#94a3b8' },
  categoryClearBtn: { width: 42, height: 42, borderRadius: 12, borderWidth: 1, borderColor: '#fecdd3', backgroundColor: '#fff1f2', alignItems: 'center', justifyContent: 'center' },
  categoryClearText: { color: '#e11d48', fontWeight: 'bold', fontSize: 14 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.4)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalContent: { backgroundColor: '#fff', borderRadius: 20, width: '100%', maxWidth: 360, maxHeight: '80%', overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 10, elevation: 10 },
  modalHeader: { padding: 16, borderBottomWidth: 1, borderColor: '#f1f5f9', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' },
  modalTitle: { fontSize: 15, fontWeight: 'bold', color: '#1e293b' },
  modalCloseBtn: { padding: 4 },
  modalCloseText: { fontSize: 16, color: '#64748b', fontWeight: 'bold' },
  modalGrid: { padding: 16, flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  gridItem: { width: 60, height: 55, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  gridItemDisabled: { backgroundColor: '#f8fafc', borderColor: '#f1f5f9', opacity: 0.4 },
  gridItemActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  gridChar: { fontSize: 18, fontWeight: 'bold', color: '#334155', height: 24 },
  gridCharDisabled: { color: '#cbd5e1' },
  gridCharActive: { color: '#fff' },
  gridCount: { fontSize: 8, color: '#2563eb', fontWeight: 'bold' },
  gridCountActive: { color: '#dbeafe' },
  modalFooter: { padding: 12, borderTopWidth: 1, borderColor: '#f1f5f9', backgroundColor: '#f8fafc', gap: 8 },
  btnReset: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#cbd5e1', paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  btnResetText: { color: '#334155', fontWeight: 'bold', fontSize: 12 },
  btnClose: { backgroundColor: '#e2e8f0', paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  btnCloseText: { color: '#475569', fontWeight: 'bold', fontSize: 12 },
});
