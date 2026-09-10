import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

export default function Index() {
  // Bước 2: Khởi tạo trạng thái lưu họ tên
  const [fullName, setFullName] = useState('');

  // Câu hỏi mở rộng 1: Bổ sung trạng thái để lưu tuổi
  const [age, setAge] = useState('');

  // Câu hỏi mở rộng 3: Thêm nút để xóa toàn bộ dữ liệu đã nhập
  const handleReset = () => {
    setFullName('');
    setAge('');
  };

  // Câu hỏi mở rộng 2: Kiểm tra tuổi nhỏ hơn 18
  const parsedAge = age.trim() !== '' ? parseInt(age, 10) : null;
  const isUnder18 = parsedAge !== null && !isNaN(parsedAge) && parsedAge < 18;
  const isAdult = parsedAge !== null && !isNaN(parsedAge) && parsedAge >= 18;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardContainer}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.title}>Quản lý thông tin cá nhân</Text>
          <Text style={styles.subtitle}>
            Thực hành React Native Hooks: useState
          </Text>

          {/* Ô nhập Họ tên */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Họ và tên:</Text>
            {/* Bước 3: Tạo TextInput và cập nhật trạng thái khi người dùng nhập */}
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Nhập họ tên"
              placeholderTextColor="#94a3b8"
            />
          </View>

          {/* Câu hỏi mở rộng 1: Ô nhập tuổi */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tuổi:</Text>
            <TextInput
              style={styles.input}
              value={age}
              onChangeText={(text) => {
                // Chỉ nhận ký tự số
                const numericText = text.replace(/[^0-9]/g, '');
                setAge(numericText);
              }}
              placeholder="Nhập tuổi"
              placeholderTextColor="#94a3b8"
              keyboardType="numeric"
              maxLength={3}
            />
          </View>

          {/* Câu hỏi mở rộng 3: Nút xóa toàn bộ dữ liệu đã nhập */}
          <TouchableOpacity
            style={[
              styles.resetButton,
              !fullName && !age && styles.resetButtonDisabled,
            ]}
            onPress={handleReset}
            disabled={!fullName && !age}
            activeOpacity={0.7}
          >
            <Text style={styles.resetButtonText}>Xóa toàn bộ dữ liệu</Text>
          </TouchableOpacity>

          {/* Khu vực kết quả hiển thị */}
          <View style={styles.resultBox}>
            <Text style={styles.resultHeader}>Kết quả hiển thị</Text>

            {/* Bước 4: Hiển thị lời chào */}
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Lời chào:</Text>
              <Text
                style={[
                  styles.greetingText,
                  !fullName && styles.placeholderText,
                ]}
              >
                {fullName ? `Xin chào, ${fullName}!` : 'Vui lòng nhập họ tên'}
              </Text>
            </View>

            {/* Câu hỏi mở rộng 2: Hiển thị thông báo nếu tuổi nhỏ hơn 18 */}
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Thông tin độ tuổi:</Text>
              {parsedAge === null ? (
                <Text style={styles.placeholderText}>Vui lòng nhập tuổi</Text>
              ) : isUnder18 ? (
                <View style={styles.alertUnder18}>
                  <Text style={styles.alertUnder18Text}>
                    ⚠️ Bạn chưa đủ 18 tuổi ({parsedAge} tuổi)
                  </Text>
                </View>
              ) : isAdult ? (
                <View style={styles.alertAdult}>
                  <Text style={styles.alertAdultText}>
                    ✅ Bạn đã đủ 18 tuổi trở lên ({parsedAge} tuổi)
                  </Text>
                </View>
              ) : (
                <Text style={styles.invalidText}>Tuổi không hợp lệ</Text>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#0f172a',
    backgroundColor: '#f8fafc',
  },
  resetButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 20,
  },
  resetButtonDisabled: {
    backgroundColor: '#fca5a5',
    opacity: 0.6,
  },
  resetButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  resultBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  resultHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  resultItem: {
    marginBottom: 12,
  },
  resultLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  greetingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2563eb',
  },
  placeholderText: {
    fontSize: 15,
    fontStyle: 'italic',
    color: '#94a3b8',
  },
  alertUnder18: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 2,
  },
  alertUnder18Text: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '600',
  },
  alertAdult: {
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 2,
  },
  alertAdultText: {
    color: '#059669',
    fontSize: 14,
    fontWeight: '600',
  },
  invalidText: {
    color: '#dc2626',
    fontSize: 14,
  },
});
