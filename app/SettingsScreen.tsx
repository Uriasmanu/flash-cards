import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { appConfig } from './../utils/constants';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const [showVersionInfo, setShowVersionInfo] = useState(false);

  const toggleVersionInfo = () => {
    setShowVersionInfo(!showVersionInfo);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Configurações</Text>

        <TouchableOpacity
          style={styles.menuItem}
        >
          <Text style={styles.menuText}>📄 Política de Privacidade</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>⭐ Avaliar App</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        {/* Accordion para Atualizações */}
        <View style={styles.accordionContainer}>
          <TouchableOpacity
            style={styles.accordionHeader}
            onPress={toggleVersionInfo}
          >
            <Text style={styles.menuText}>🔄 Atualizações</Text>
            <View style={styles.headerRight}>
              <Text style={styles.versionText}>v {appConfig.version}</Text>
              <Text style={[styles.accordionArrow, showVersionInfo && styles.accordionArrowOpen]}>
                ›
              </Text>
            </View>
          </TouchableOpacity>

          {showVersionInfo && (
            <View style={styles.accordionContent}>
              <View style={styles.versionInfo}>
                <Text style={styles.versionTitle}>Informações da Versão</Text>

                <View style={styles.versionDetail}>
                  <Text style={styles.versionLabel}>Versão:</Text>
                  <Text style={styles.versionValue}>{appConfig.version}</Text>
                </View>

                <View style={styles.versionDetail}>
                  <Text style={styles.versionLabel}>Última atualização:</Text>
                  <Text style={styles.versionValue}>{appConfig.lastUpload}</Text>
                </View>

                <View style={styles.versionDetailFeature}>
                  <Text style={styles.versionLabel}>Novidades:</Text>
                  <View style={styles.featuresList}>
                    {appConfig.features.map((feature, index) => (
                      <Text key={index} style={styles.featureItem}>
                        • {feature}
                      </Text>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: '#fff',
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginVertical: 12,
    textTransform: 'uppercase',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  menuArrow: {
    fontSize: 18,
    color: '#999',
  },
  // Estilos do Accordion
  accordionContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  versionText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  accordionArrow: {
    fontSize: 18,
    color: '#999',
    transform: [{ rotate: '0deg' }],
  },
  accordionArrowOpen: {
    transform: [{ rotate: '90deg' }],
  },
  accordionContent: {
    backgroundColor: '#f9f9f9',
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  versionInfo: {
    paddingVertical: 16,
    gap: 12,
  },
  versionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  versionDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  versionLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    flex: 1,
  },
  versionValue: {
    fontSize: 14,
    color: '#333',
    flex: 2,
    textAlign: 'right',
  },
  versionDetailFeature: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10
  },
  featuresList: {
    flex: 2,
  },
  featureItem: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  checkUpdateText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default SettingsScreen;