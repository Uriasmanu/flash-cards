import { useNotification } from '@/context/NotificationContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Animated,
  Linking,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import i18n, { changeLanguage } from '../locates/index';
import { appConfig } from './../utils/constants';

// --- Cores e Design System ---
const COLORS = {
  PRIMARY: '#2563EB',
  PRIMARY_DARK: '#1D4ED8',
  BACKGROUND: '#FFFFFF',
  BACKGROUND_GRAY: '#F8FAFC',
  CARD_BACKGROUND: '#FFFFFF',
  TEXT_PRIMARY: '#1E293B',
  TEXT_SECONDARY: '#64748B',
  TEXT_DISABLED: '#94A3B8',
  BORDER: '#E2E8F0',
  BORDER_LIGHT: '#F1F5F9',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  ERROR: '#EF4444',
  SWITCH_TRUE: '#2563EB',
  SWITCH_FALSE: '#D1D5DB',
};

const SettingsScreen = () => {
  const [showVersionInfo, setShowVersionInfo] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [language, setLanguage] = useState('pt');
  const [tempTime, setTempTime] = useState(new Date());
  const [rotateAnim] = useState(new Animated.Value(0));

  const {
    hasPermission,
    isNotificationEnabled,
    notificationTime,
    updateNotificationTime,
    toggleNotifications,
    getNotificationScheduleStatus,
    requestPermissions,
  } = useNotification();

  const [scheduleStatus, setScheduleStatus] = useState({
    isEnabled: false,
    scheduledTime: { hour: 19, minute: 0 },
    hasScheduledNotifications: false
  });

  useEffect(() => {
    loadNotificationStatus();
    loadLanguage();
  }, []);

  useEffect(() => {
    // Animação do accordion
    Animated.timing(rotateAnim, {
      toValue: showVersionInfo ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [showVersionInfo]);

  const loadNotificationStatus = async () => {
    const status = await getNotificationScheduleStatus();
    setScheduleStatus(status);
  };

  const loadLanguage = async () => {
    const storedLang = await AsyncStorage.getItem('appLanguage');
    if (storedLang) setLanguage(storedLang);
  }

  const handleChangeLanguage = async (newLang: string) => {
    try {
      const success = await changeLanguage(newLang);
      if (success) {
        setLanguage(newLang);
        Alert.alert(
          i18n.t('configuracao.idiomaAlteradoTitle'),
          i18n.t('configuracao.idiomaAlteradoTexto', { lang: newLang.toUpperCase() })
        );
      } else {
        Alert.alert('Erro', i18n.t('configuracao.alertaErro'));
      }
    } catch (error) {
      Alert.alert('Erro', i18n.t('configuracao.alertaErro'));
    }
  }

  const handlePrivacyPolicy = async () => {
    const url = 'https://uriasmanu.github.io/flash-cards/';

    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Erro', i18n.t('configuracao.erroAbrirLink'));
      }
    } catch (error) {
      Alert.alert('Erro', i18n.t('configuracao.erroPolitica'));
    }
  };

  const handleNotificationToggle = async (enabled: boolean) => {
    if (enabled && !hasPermission) {
      const granted = await requestPermissions();
      if (!granted) {
        Alert.alert(
          i18n.t('configuracao.alertaPermissaoTitle'),
          i18n.t('configuracao.alertaPermissaoTexto'),
          [
            {
              text: i18n.t('configuracao.configuracoes'),
              onPress: () => Linking.openSettings()
            },
            {
              text: i18n.t('configuracao.cancelar'),
              style: 'cancel'
            }
          ]
        );
        return;
      }
    }

    const result = await toggleNotifications(enabled);
    if (result.success) {
      await loadNotificationStatus();
      // Removido alerta para melhor UX - feedback visual do switch é suficiente
    } else {
      Alert.alert('Erro', i18n.t('configuracao.alertaErro'));
    }
  };

  const handleTimeChange = async (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);

    if (selectedTime) {
      const hour = selectedTime.getHours();
      const minute = selectedTime.getMinutes();

      setTempTime(selectedTime);

      const result = await updateNotificationTime(hour, minute);
      if (result.success) {
        await loadNotificationStatus();
        // Feedback sutil em vez de alerta
      } else {
        Alert.alert('Erro', i18n.t('configuracao.horarioDefinido'));
      }
    }
  };

  const showTimePickerModal = () => {
    const currentTime = new Date();
    currentTime.setHours(notificationTime.hour);
    currentTime.setMinutes(notificationTime.minute);
    setTempTime(currentTime);
    setShowTimePicker(true);
  };

  const toggleVersionInfo = () => {
    setShowVersionInfo(!showVersionInfo);
  };

  const formatTime = (hour: number, minute: number) => {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg']
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{i18n.t('configuracao.titulo')}</Text>
        </View>

        {/* Seção de Notificações */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {i18n.t('configuracao.cabecalho')}
          </Text>

          <View style={styles.card}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <View style={styles.settingHeader}>
                  <Text style={styles.settingTitle}>
                    {i18n.t('configuracao.lembrete')}
                  </Text>
                  <View style={[
                    styles.statusBadge,
                    isNotificationEnabled ? styles.statusActive : styles.statusInactive
                  ]}>
                    <Text style={styles.statusText}>
                      {isNotificationEnabled ? 'Ativo' : 'Inativo'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.settingDescription}>
                  {i18n.t('configuracao.lembreteTexto')}
                </Text>
              </View>
              <Switch
                value={isNotificationEnabled}
                onValueChange={handleNotificationToggle}
                trackColor={{ false: COLORS.SWITCH_FALSE, true: COLORS.SWITCH_TRUE }}
                thumbColor={COLORS.BACKGROUND}
                ios_backgroundColor={COLORS.SWITCH_FALSE}
              />
            </View>

            <View style={styles.divider} />

            <TouchableOpacity
              style={[
                styles.settingItem,
                !isNotificationEnabled && styles.settingItemDisabled
              ]}
              onPress={showTimePickerModal}
              disabled={!isNotificationEnabled}
            >
              <View style={styles.settingInfo}>
                <Text style={[
                  styles.settingTitle,
                  !isNotificationEnabled && styles.settingTextDisabled
                ]}>
                  {i18n.t('configuracao.horarioLembrete')}
                </Text>
                <View style={styles.timeContainer}>
                  <Text style={[
                    styles.timeText,
                    !isNotificationEnabled && styles.settingTextDisabled
                  ]}>
                    {formatTime(notificationTime.hour, notificationTime.minute)}
                  </Text>
                  <View style={[
                    styles.timeBadge,
                    !isNotificationEnabled && styles.timeBadgeDisabled
                  ]}>
                    <Text style={styles.timeBadgeText}>Horário</Text>
                  </View>
                </View>
              </View>
              <Text style={[
                styles.menuArrow,
                !isNotificationEnabled && styles.settingTextDisabled
              ]}>
                ›
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Seção de Idioma */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferências</Text>
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleChangeLanguage(language === 'pt' ? 'en' : 'pt')}
            >
              <View style={styles.menuItemContent}>
                <View style={styles.languageIcon}>
                  <Text style={styles.languageIconText}>
                    {language === 'pt' ? '🇧🇷' : '🇺🇸'}
                  </Text>
                </View>
                <View style={styles.menuTextContainer}>
                  <Text style={styles.menuText}>Idioma do App</Text>
                  <Text style={styles.menuSubtext}>
                    {language === 'pt' ? 'Português Brasileiro' : 'English'}
                  </Text>
                </View>
              </View>
              <View style={styles.menuRight}>
                <Text style={styles.changeText}>Alterar</Text>
                <Text style={styles.menuArrow}>›</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Seção de Links e Informações */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações</Text>
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handlePrivacyPolicy}
            >
              <View style={styles.menuItemContent}>
                <View style={[styles.menuIcon, styles.privacyIcon]}>
                  <Text style={styles.menuIconText}>📄</Text>
                </View>
                <View style={styles.menuTextContainer}>
                  <Text style={styles.menuText}>
                    {i18n.t('configuracao.politica')}
                  </Text>
                  <Text style={styles.menuSubtext}>Termos e condições de uso</Text>
                </View>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.menuItem}
              onPress={toggleVersionInfo}
            >
              <View style={styles.menuItemContent}>
                <View style={[styles.menuIcon, styles.versionIcon]}>
                  <Text style={styles.menuIconText}>🔄</Text>
                </View>
                <View style={styles.menuTextContainer}>
                  <Text style={styles.menuText}>
                    {i18n.t('configuracao.atualizacao')}
                  </Text>
                  <Text style={styles.menuSubtext}>Versão {appConfig.version}</Text>
                </View>
              </View>
              <View style={styles.menuRight}>
                <Animated.Text style={[styles.menuArrow, { transform: [{ rotate }] }]}>
                  ›
                </Animated.Text>
              </View>
            </TouchableOpacity>

            {showVersionInfo && (
              <View style={styles.accordionContent}>
                <View style={styles.versionInfo}>
                  <View style={styles.versionDetail}>
                    <Text style={styles.versionLabel}>Versão</Text>
                    <Text style={styles.versionValue}>{appConfig.version}</Text>
                  </View>

                  <View style={styles.versionDetail}>
                    <Text style={styles.versionLabel}>Última atualização</Text>
                    <Text style={styles.versionValue}>{appConfig.lastUpload}</Text>
                  </View>

                  <View style={styles.featuresSection}>
                    <Text style={styles.featuresTitle}>Novidades desta versão</Text>
                    <View style={styles.featuresList}>
                      {appConfig.features.map((feature: string, index: number) => (
                        <View key={index} style={styles.featureItem}>
                          <View style={styles.featureDot} />
                          <Text style={styles.featureText}>{feature}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>FlashCards © 2024</Text>
        </View>
      </ScrollView>

      {/* Modal do Time Picker */}
      <Modal
        visible={showTimePicker}
        transparent={true}
        animationType="fade"
      >

        <TouchableWithoutFeedback onPress={() => setShowTimePicker(false)}>
          <View style={styles.modalBackground} />
        </TouchableWithoutFeedback>

        <View style={styles.timePickerContainer}>
          <DateTimePicker
            value={tempTime}
            mode="time"
            display='spinner'
            onChange={handleTimeChange}
            style={styles.timePicker}
          />
        </View>

      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_GRAY,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.TEXT_PRIMARY,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: COLORS.CARD_BACKGROUND,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingItemDisabled: {
    opacity: 0.5,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  settingTitle: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '600',
    flex: 1,
  },
  settingDescription: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 20,
  },
  settingTextDisabled: {
    color: COLORS.TEXT_DISABLED,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusActive: {
    backgroundColor: '#DCFCE7',
  },
  statusInactive: {
    backgroundColor: '#FEF2F2',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  timeText: {
    fontSize: 16,
    color: COLORS.PRIMARY,
    fontWeight: '600',
    marginRight: 8,
  },
  timeBadge: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  timeBadgeDisabled: {
    backgroundColor: COLORS.TEXT_DISABLED,
  },
  timeBadgeText: {
    fontSize: 12,
    color: COLORS.BACKGROUND,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.BORDER_LIGHT,
    marginVertical: 12,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  privacyIcon: {
    backgroundColor: '#DBEAFE',
  },
  versionIcon: {
    backgroundColor: '#FEF3C7',
  },
  languageIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#E0E7FF',
  },
  languageIconText: {
    fontSize: 20,
  },
  menuIconText: {
    fontSize: 18,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuText: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '500',
    marginBottom: 2,
  },
  menuSubtext: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    fontSize: 14,
    color: COLORS.PRIMARY,
    fontWeight: '500',
    marginRight: 8,
  },
  menuArrow: {
    fontSize: 18,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: 'bold',
  },
  accordionContent: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER_LIGHT,
  },
  versionInfo: {
    gap: 16,
  },
  versionDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  versionLabel: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '500',
  },
  versionValue: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '600',
  },
  featuresSection: {
    marginTop: 8,
  },
  featuresTitle: {
    fontSize: 15,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '600',
    marginBottom: 12,
  },
  featuresList: {
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.PRIMARY,
    marginTop: 6,
  },
  featureText: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    flex: 1,
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalBackground: {
    flex: 1,
  },
  timePickerContainer: {
    backgroundColor: COLORS.BACKGROUND,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  timePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  timePickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.BACKGROUND_GRAY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '300',
    lineHeight: 20,
  },
  timePicker: {
    height: 160,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
});

export default SettingsScreen;