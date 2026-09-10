import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';

export default function Index() {
  const [activeTab, setActiveTab] = useState<'connection' | 'profile'>('connection');

  return (
    <View style={styles.mainContainer}>
      {/* Thanh chuyển đổi bài tập */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'connection' && styles.tabButtonActive]}
          onPress={() => setActiveTab('connection')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'connection' && styles.tabButtonTextActive,
            ]}
          >
            Bài 2: useEffect (Kết nối)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'profile' && styles.tabButtonActive]}
          onPress={() => setActiveTab('profile')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'profile' && styles.tabButtonTextActive,
            ]}
          >
            Bài 1: useState (Họ tên)
          </Text>
        </TouchableOpacity>
      </View>

      {/* Nội dung bài tập */}
      {activeTab === 'connection' ? <ConnectionExercise /> : <ProfileExercise />}
    </View>
  );
}

// ============================================================================
// BÀI TẬP: THEO DÕI TRẠNG THÁI KẾT NỐI GIẢ LẬP (useEffect)
// ============================================================================
function ConnectionExercise() {
  // Bước 1: Tạo hai trạng thái
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState('Chưa kết nối');

  // Câu hỏi mở rộng 1: Trạng thái lưu thời điểm kết nối gần nhất
  const [lastConnectedTime, setLastConnectedTime] = useState<string | null>(null);

  // Bước 2: Dùng useEffect theo dõi isConnected
  useEffect(() => {
    if (isConnected) {
      setMessage('Thiết bị đã kết nối');

      // Câu hỏi mở rộng 1: Cập nhật thời điểm kết nối gần nhất khi kết nối thành công
      const now = new Date();
      const timeStr = now.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      const dateStr = now.toLocaleDateString('vi-VN');
      setLastConnectedTime(`${timeStr} ngày ${dateStr}`);
    } else {
      setMessage('Thiết bị đã ngắt kết nối');
    }
  }, [isConnected]);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.card}>
        <Text style={styles.title}>Trạng thái kết nối</Text>
        <Text style={styles.subtitle}>Bài tập thực hành React Native: useEffect</Text>

        {/* Khối công tắc kết nối */}
        <View style={styles.switchRow}>
          <View style={styles.switchLabelContainer}>
            <View
              style={[
                styles.statusIndicator,
                { backgroundColor: isConnected ? '#16a34a' : '#dc2626' },
              ]}
            />
            <Text style={styles.switchLabel}>
              {isConnected ? 'Đang bật kết nối' : 'Đang tắt kết nối'}
            </Text>
          </View>

          {/* Bước 3: Tạo Switch để thay đổi trạng thái */}
          <Switch
            value={isConnected}
            onValueChange={setIsConnected}
            trackColor={{ false: '#cbd5e1', true: '#86efac' }}
            thumbColor={isConnected ? '#16a34a' : '#f87171'}
          />
        </View>

        {/* Khối hiển thị thông báo */}
        <View
          style={[
            styles.statusCard,
            {
              backgroundColor: isConnected ? '#f0fdf4' : '#fef2f2',
              borderColor: isConnected ? '#bbf7d0' : '#fecaca',
            },
          ]}
        >
          <Text style={styles.statusCardHeader}>Thông báo trạng thái:</Text>

          {/* Bước 4 & Câu hỏi mở rộng 2: Hiển thị thông báo với màu xanh/đỏ */}
          <Text
            style={[
              styles.messageText,
              // Đổi màu chữ thành xanh (#16a34a) khi đã kết nối và đỏ (#dc2626) khi mất kết nối
              { color: isConnected ? '#16a34a' : '#dc2626' },
            ]}
          >
            {message}
          </Text>

          {/* Câu hỏi mở rộng 1: Hiển thị thời điểm kết nối gần nhất */}
          <View style={styles.timeRow}>
            <Text style={styles.timeLabel}>Thời điểm kết nối gần nhất: </Text>
            <Text style={styles.timeValue}>
              {lastConnectedTime ? lastConnectedTime : 'Chưa có kết nối nào'}
            </Text>
          </View>
        </View>

        {/* Câu hỏi mở rộng 3: Giải thích điều gì xảy ra nếu bỏ [isConnected] */}
        <View style={styles.explanationBox}>
          <Text style={styles.explanationTitle}>
            💡 Câu hỏi mở rộng 3: Điều gì xảy ra nếu bỏ [isConnected]?
          </Text>
          <Text style={styles.explanationText}>
            • <Text style={styles.boldText}>Nếu bỏ hẳn mảng phụ thuộc (không truyền tham số thứ 2):</Text>{' '}
            <Text style={styles.codeText}>useEffect(() =&gt; &#123;...&#125;)</Text> sẽ chạy lại sau{' '}
            <Text style={styles.boldText}>mọi lần render</Text>. Khi gọi{' '}
            <Text style={styles.codeText}>setMessage()</Text>, component render lại → effect lại chạy → lặp vô tận (infinite loop), gây đơ ứng dụng.
          </Text>
          <Text style={[styles.explanationText, { marginTop: 6 }]}>
            • <Text style={styles.boldText}>Nếu truyền mảng rỗng []:</Text>{' '}
            <Text style={styles.codeText}>useEffect(() =&gt; &#123;...&#125;, [])</Text> chỉ chạy đúng 1 lần khi màn hình khởi tạo (mount). Khi người dùng gạt Switch, effect{' '}
            <Text style={styles.boldText}>sẽ không chạy lại</Text>, thông báo sẽ không được cập nhật.
          </Text>
          <Text style={[styles.explanationText, { marginTop: 6 }]}>
            • <Text style={styles.boldText}>Khi giữ [isConnected]:</Text> React chỉ kích hoạt effect khi giá trị của{' '}
            <Text style={styles.codeText}>isConnected</Text> thực sự thay đổi giữa các lần render, đảm bảo hiệu năng và tính chính xác.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

// ============================================================================
// BÀI TẬP TRƯỚC ĐÓ: QUẢN LÝ THÔNG TIN CÁ NHÂN (useState)
// ============================================================================
function ProfileExercise() {
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');

  const handleReset = () => {
    setFullName('');
    setAge('');
  };

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
          <Text style={styles.subtitle}>Thực hành React Native Hooks: useState</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Họ và tên:</Text>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Nhập họ tên"
              placeholderTextColor="#94a3b8"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tuổi:</Text>
            <TextInput
              style={styles.input}
              value={age}
              onChangeText={(text) => {
                const numericText = text.replace(/[^0-9]/g, '');
                setAge(numericText);
              }}
              placeholder="Nhập tuổi"
              placeholderTextColor="#94a3b8"
              keyboardType="numeric"
              maxLength={3}
            />
          </View>

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

          <View style={styles.resultBox}>
            <Text style={styles.resultHeader}>Kết quả hiển thị</Text>

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

// ============================================================================
// STYLES
// ============================================================================
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  keyboardContainer: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    gap: 12,
    justifyContent: 'center',
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  tabButtonActive: {
    backgroundColor: '#2563eb',
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  tabButtonTextActive: {
    color: '#ffffff',
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
    maxWidth: 520,
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
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
  },
  switchLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  statusCard: {
    padding: 18,
    borderRadius: 12,
    borderWidth: 1.5,
    marginBottom: 20,
  },
  statusCardHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  messageText: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
  },
  timeRow: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 10,
    marginTop: 4,
  },
  timeLabel: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  timeValue: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '600',
    marginTop: 2,
  },
  explanationBox: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  explanationTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 10,
  },
  explanationText: {
    fontSize: 13,
    lineHeight: 19,
    color: '#334155',
  },
  boldText: {
    fontWeight: '700',
    color: '#0f172a',
  },
  codeText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    backgroundColor: '#e2e8f0',
    color: '#0f172a',
    fontWeight: '600',
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
