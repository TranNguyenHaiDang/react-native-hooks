import React, { useState, useEffect, useContext, useReducer } from 'react';
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
  Image,
  ActivityIndicator,
} from 'react-native';
// Câu hỏi mở rộng bài 3: Nhập UserContext, UserProvider, useUser từ tệp riêng biệt
import {
  UserContext,
  UserProvider,
  useUser,
  defaultUserData,
} from '../context/UserContext';

export default function Index() {
  const [activeTab, setActiveTab] = useState<'reducer' | 'context' | 'connection' | 'state'>('reducer');

  return (
    <View style={styles.mainContainer}>
      {/* Thanh chuyển đổi giữa các bài tập thực hành */}
      <View style={styles.tabBarContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabBar}
        >
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'reducer' && styles.tabButtonActive]}
            onPress={() => setActiveTab('reducer')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === 'reducer' && styles.tabButtonTextActive,
              ]}
            >
              Bài 4: useReducer
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'context' && styles.tabButtonActive]}
            onPress={() => setActiveTab('context')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === 'context' && styles.tabButtonTextActive,
              ]}
            >
              Bài 3: useContext
            </Text>
          </TouchableOpacity>

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
              Bài 2: useEffect
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'state' && styles.tabButtonActive]}
            onPress={() => setActiveTab('state')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === 'state' && styles.tabButtonTextActive,
              ]}
            >
              Bài 1: useState
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Hiển thị nội dung bài tập được chọn */}
      {activeTab === 'reducer' && <ReducerExercise />}
      {activeTab === 'context' && <ContextExercise />}
      {activeTab === 'connection' && <ConnectionExercise />}
      {activeTab === 'state' && <ProfileExercise />}
    </View>
  );
}

// ============================================================================
// BÀI TẬP 4: QUẢN LÝ FORM ĐĂNG NHẬP (useReducer)
// ============================================================================

// Định nghĩa kiểu dữ liệu State
interface FormState {
  email: string;
  password: string;
  error: string;
  isSubmitting: boolean; // Câu hỏi mở rộng 3: Trạng thái đang gửi form
  successMessage: string;
}

// Định nghĩa kiểu dữ liệu Action
type FormAction =
  | { type: 'SET_EMAIL'; payload: string }
  | { type: 'SET_PASSWORD'; payload: string }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'START_SUBMIT' }
  | { type: 'SUBMIT_SUCCESS'; payload: string }
  | { type: 'RESET' };

// Bước 1: Khai báo trạng thái ban đầu
const initialFormState: FormState = {
  email: '',
  password: '',
  error: '',
  isSubmitting: false, // Câu hỏi mở rộng 3
  successMessage: '',
};

// Bước 2: Viết reducer
function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_EMAIL':
      return { ...state, email: action.payload, error: '', successMessage: '' };

    case 'SET_PASSWORD':
      return { ...state, password: action.payload, error: '', successMessage: '' };

    case 'SET_ERROR':
      return { ...state, error: action.payload, isSubmitting: false };

    case 'START_SUBMIT':
      return { ...state, isSubmitting: true, error: '', successMessage: '' };

    case 'SUBMIT_SUCCESS':
      return { ...state, isSubmitting: false, successMessage: action.payload, error: '' };

    case 'RESET':
      return initialFormState;

    default:
      return state;
  }
}

function ReducerExercise() {
  // Bước 3: Khởi tạo reducer trong component
  const [state, dispatch] = useReducer(formReducer, initialFormState);

  // Bước 5: Kiểm tra dữ liệu khi người dùng nhấn đăng nhập
  const handleLogin = () => {
    // 1. Kiểm tra bỏ trống dữ liệu
    if (!state.email.trim() || !state.password.trim()) {
      dispatch({
        type: 'SET_ERROR',
        payload: 'Vui lòng nhập đầy đủ thông tin',
      });
      return;
    }

    // Câu hỏi mở rộng 1: Kiểm tra email có chứa ký tự @
    if (!state.email.includes('@')) {
      dispatch({
        type: 'SET_ERROR',
        payload: 'Email không hợp lệ (phải chứa ký tự @)',
      });
      return;
    }

    // Câu hỏi mở rộng 2: Yêu cầu mật khẩu có ít nhất sáu ký tự
    if (state.password.length < 6) {
      dispatch({
        type: 'SET_ERROR',
        payload: 'Mật khẩu phải có ít nhất 6 ký tự',
      });
      return;
    }

    // Câu hỏi mở rộng 3: Bật trạng thái isSubmitting và giả lập gửi dữ liệu lên server
    dispatch({ type: 'START_SUBMIT' });

    // Giả lập độ trễ mạng (API call) 1.5 giây
    setTimeout(() => {
      dispatch({
        type: 'SUBMIT_SUCCESS',
        payload: `Đăng nhập thành công với tài khoản: ${state.email}`,
      });
    }, 1500);
  };

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
          <Text style={styles.title}>Quản lý form đăng nhập</Text>
          <Text style={styles.subtitle}>Bài tập thực hành React Native: useReducer</Text>

          {/* Form đăng nhập */}
          <View style={styles.formContainer}>
            {/* Bước 4: Kết nối ô nhập email với reducer */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email:</Text>
              <TextInput
                style={styles.input}
                value={state.email}
                onChangeText={(text) =>
                  dispatch({ type: 'SET_EMAIL', payload: text })
                }
                placeholder="Email (ví dụ: user@gmail.com)"
                placeholderTextColor="#94a3b8"
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!state.isSubmitting}
              />
            </View>

            {/* Bước 4: Kết nối ô nhập mật khẩu với reducer */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mật khẩu:</Text>
              <TextInput
                style={styles.input}
                value={state.password}
                onChangeText={(text) =>
                  dispatch({ type: 'SET_PASSWORD', payload: text })
                }
                placeholder="Mật khẩu (tối thiểu 6 ký tự)"
                placeholderTextColor="#94a3b8"
                secureTextEntry
                editable={!state.isSubmitting}
              />
            </View>

            {/* Bước 6: Hiển thị thông báo lỗi */}
            {state.error ? (
              <View style={styles.formErrorBox}>
                <Text style={styles.formErrorText}>⚠️ {state.error}</Text>
              </View>
            ) : null}

            {/* Thông báo đăng nhập thành công */}
            {state.successMessage ? (
              <View style={styles.formSuccessBox}>
                <Text style={styles.formSuccessText}>🎉 {state.successMessage}</Text>
              </View>
            ) : null}

            {/* Bước 6: Nút Đăng nhập và Nút Đặt lại */}
            <View style={styles.buttonGroup}>
              {/* Nút Đăng nhập có hiệu ứng loading (Câu hỏi mở rộng 3) */}
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  state.isSubmitting && styles.buttonDisabled,
                ]}
                onPress={handleLogin}
                disabled={state.isSubmitting}
                activeOpacity={0.8}
              >
                {state.isSubmitting ? (
                  <View style={styles.submittingRow}>
                    <ActivityIndicator color="#ffffff" size="small" />
                    <Text style={styles.submitButtonText}>Đang đăng nhập...</Text>
                  </View>
                ) : (
                  <Text style={styles.submitButtonText}>Đăng nhập</Text>
                )}
              </TouchableOpacity>

              {/* Nút Đặt lại: dispatch action RESET */}
              <TouchableOpacity
                style={styles.resetFormButton}
                onPress={() => dispatch({ type: 'RESET' })}
                disabled={state.isSubmitting}
                activeOpacity={0.8}
              >
                <Text style={styles.resetFormButtonText}>Đặt lại</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Trạng thái hiện tại trong Reducer (Xem trực tiếp để học tập) */}
          <View style={styles.stateDebugBox}>
            <Text style={styles.stateDebugHeader}>📊 State hiện tại trong useReducer:</Text>
            <Text style={styles.stateDebugText}>
              • email: <Text style={styles.codeText}>"{state.email}"</Text>
            </Text>
            <Text style={styles.stateDebugText}>
              • password: <Text style={styles.codeText}>"{state.password ? '•'.repeat(state.password.length) : ''}"</Text>
            </Text>
            <Text style={styles.stateDebugText}>
              • isSubmitting: <Text style={styles.codeText}>{String(state.isSubmitting)}</Text>
            </Text>
            <Text style={styles.stateDebugText}>
              • error: <Text style={styles.codeText}>"{state.error}"</Text>
            </Text>
          </View>

          {/* Hộp giải thích 3 câu hỏi mở rộng */}
          <View style={styles.explanationBox}>
            <Text style={styles.explanationTitle}>💡 Giải quyết 3 câu hỏi mở rộng</Text>
            <Text style={styles.explanationText}>
              • <Text style={styles.boldText}>Câu hỏi 1 (Kiểm tra email có @):</Text>{' '}
              Sử dụng <Text style={styles.codeText}>!state.email.includes('@')</Text> để báo lỗi nếu định dạng email thiếu ký tự @.
            </Text>
            <Text style={[styles.explanationText, { marginTop: 6 }]}>
              • <Text style={styles.boldText}>Câu hỏi 2 (Mật khẩu ít nhất 6 ký tự):</Text>{' '}
              Kiểm tra <Text style={styles.codeText}>state.password.length &lt; 6</Text> trước khi tiến hành xác thực.
            </Text>
            <Text style={[styles.explanationText, { marginTop: 6 }]}>
              • <Text style={styles.boldText}>Câu hỏi 3 (Trạng thái isSubmitting):</Text>{' '}
              Khai báo <Text style={styles.codeText}>isSubmitting: boolean</Text> trong state. Khi bắt đầu đăng nhập, dispatch action{' '}
              <Text style={styles.codeText}>START_SUBMIT</Text> để hiển thị vòng xoay <Text style={styles.codeText}>ActivityIndicator</Text> và khóa nút nhấn, giả lập gọi API bất đồng bộ.
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ============================================================================
// BÀI TẬP 3: CHIA SẺ THÔNG TIN NGƯỜI DÙNG (useContext)
// ============================================================================
function ContextExercise() {
  return (
    <UserProvider>
      <ContextExerciseContent />
    </UserProvider>
  );
}

function ContextExerciseContent() {
  const { user, setUser } = useUser();
  const [inputName, setInputName] = useState(user?.name || '');

  const handleUpdateName = () => {
    if (user) {
      setUser({ ...user, name: inputName.trim() || 'Người dùng ẩn danh' });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.card}>
        <Text style={styles.title}>Chia sẻ thông tin người dùng</Text>
        <Text style={styles.subtitle}>Bài tập thực hành React Native: useContext</Text>

        <View style={styles.providerControlBox}>
          <Text style={styles.controlHeader}>⚙️ Thay đổi giá trị ở cấp Provider (Bước 5)</Text>
          <Text style={styles.controlSub}>
            Nhập tên mới bên dưới để thấy ProfileScreen tự động cập nhật mà không cần truyền props:
          </Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.providerInput}
              value={inputName}
              onChangeText={setInputName}
              placeholder="Nhập tên mới..."
              placeholderTextColor="#94a3b8"
            />
            <TouchableOpacity
              style={[styles.updateButton, !user && styles.buttonDisabled]}
              onPress={handleUpdateName}
              disabled={!user}
              activeOpacity={0.8}
            >
              <Text style={styles.updateButtonText}>Cập nhật</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ProfileScreen />

        <View style={styles.explanationBox}>
          <Text style={styles.explanationTitle}>💡 Điểm nổi bật của bài tập useContext</Text>
          <Text style={styles.explanationText}>
            • <Text style={styles.boldText}>Câu hỏi mở rộng 1:</Text> Context lưu trữ trọn bộ thông tin:{' '}
            <Text style={styles.codeText}>name</Text>, <Text style={styles.codeText}>email</Text> và{' '}
            <Text style={styles.codeText}>avatar</Text>.
          </Text>
          <Text style={[styles.explanationText, { marginTop: 6 }]}>
            • <Text style={styles.boldText}>Câu hỏi mở rộng 2:</Text> Nút "Đăng xuất" nằm bên trong{' '}
            <Text style={styles.codeText}>ProfileScreen</Text> gọi hàm <Text style={styles.codeText}>logout()</Text> từ Context để cập nhật trạng thái toàn cục.
          </Text>
          <Text style={[styles.explanationText, { marginTop: 6 }]}>
            • <Text style={styles.boldText}>Câu hỏi mở rộng 3:</Text> Đã tách riêng thành file{' '}
            <Text style={styles.codeText}>src/context/UserContext.tsx</Text> giúp tái sử dụng ở bất kỳ component nào trong toàn ứng dụng.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

function ProfileScreen() {
  const context = useContext(UserContext);

  if (!context) {
    return <Text style={styles.errorText}>Lỗi: ProfileScreen nằm ngoài UserProvider!</Text>;
  }

  const { user, logout, login } = context;

  return (
    <View style={styles.profileBox}>
      <Text style={styles.profileSectionTitle}>📱 Component: ProfileScreen</Text>

      {user ? (
        <View style={styles.profileContent}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: user.avatar }}
              style={styles.avatar}
              resizeMode="cover"
            />
            <View style={styles.onlineBadge} />
          </View>

          <Text style={styles.greetingText}>Xin chào, {user.name}</Text>
          <Text style={styles.emailText}>✉️ {user.email}</Text>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={logout}
            activeOpacity={0.8}
          >
            <Text style={styles.logoutButtonText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.loggedOutContent}>
          <Text style={styles.loggedOutIcon}>🔒</Text>
          <Text style={styles.loggedOutTitle}>Đã đăng xuất</Text>
          <Text style={styles.loggedOutSub}>
            Bạn hiện chưa đăng nhập. Nhấn nút bên dưới để khôi phục phiên đăng nhập.
          </Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => login(defaultUserData)}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>Đăng nhập lại</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// ============================================================================
// BÀI TẬP 2: THEO DÕI TRẠNG THÁI KẾT NỐI GIẢ LẬP (useEffect)
// ============================================================================
function ConnectionExercise() {
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState('Chưa kết nối');
  const [lastConnectedTime, setLastConnectedTime] = useState<string | null>(null);

  useEffect(() => {
    if (isConnected) {
      setMessage('Thiết bị đã kết nối');

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

          <Switch
            value={isConnected}
            onValueChange={setIsConnected}
            trackColor={{ false: '#cbd5e1', true: '#86efac' }}
            thumbColor={isConnected ? '#16a34a' : '#f87171'}
          />
        </View>

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
          <Text
            style={[
              styles.messageText,
              { color: isConnected ? '#16a34a' : '#dc2626' },
            ]}
          >
            {message}
          </Text>

          <View style={styles.timeRow}>
            <Text style={styles.timeLabel}>Thời điểm kết nối gần nhất: </Text>
            <Text style={styles.timeValue}>
              {lastConnectedTime ? lastConnectedTime : 'Chưa có kết nối nào'}
            </Text>
          </View>
        </View>

        <View style={styles.explanationBox}>
          <Text style={styles.explanationTitle}>
            💡 Câu hỏi mở rộng 3: Điều gì xảy ra nếu bỏ [isConnected]?
          </Text>
          <Text style={styles.explanationText}>
            • <Text style={styles.boldText}>Nếu bỏ hẳn mảng phụ thuộc:</Text> useEffect chạy lại sau{' '}
            <Text style={styles.boldText}>mọi lần render</Text>, gọi setMessage làm component re-render → gây vòng lặp vô tận (infinite loop).
          </Text>
          <Text style={[styles.explanationText, { marginTop: 6 }]}>
            • <Text style={styles.boldText}>Nếu truyền mảng rỗng []:</Text> Chỉ chạy đúng 1 lần khi mount. Khi gạt Switch, effect{' '}
            <Text style={styles.boldText}>sẽ không chạy lại</Text>, thông báo không được cập nhật.
          </Text>
          <Text style={[styles.explanationText, { marginTop: 6 }]}>
            • <Text style={styles.boldText}>Khi giữ [isConnected]:</Text> React chỉ kích hoạt effect khi giá trị của{' '}
            <Text style={styles.codeText}>isConnected</Text> thực sự thay đổi, đảm bảo chính xác và tối ưu hiệu năng.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

// ============================================================================
// BÀI TẬP 1: QUẢN LÝ THÔNG TIN CÁ NHÂN (useState)
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
  tabBarContainer: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    alignItems: 'center',
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  tabButtonActive: {
    backgroundColor: '#2563eb',
  },
  tabButtonText: {
    fontSize: 13,
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
    marginBottom: 20,
  },
  // Style cho Bài 4 (useReducer Form)
  formContainer: {
    marginBottom: 16,
  },
  formErrorBox: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginBottom: 14,
  },
  formErrorText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '600',
  },
  formSuccessBox: {
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 14,
  },
  formSuccessText: {
    color: '#059669',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonGroup: {
    gap: 10,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  submittingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resetFormButton: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: 'center',
  },
  resetFormButtonText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '600',
  },
  stateDebugBox: {
    backgroundColor: '#f8fafc',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  stateDebugHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  stateDebugText: {
    fontSize: 12,
    color: '#475569',
    marginBottom: 3,
  },
  // Style cho phần Provider Controller (Bài 3)
  providerControlBox: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    marginBottom: 20,
  },
  controlHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e40af',
    marginBottom: 4,
  },
  controlSub: {
    fontSize: 12,
    color: '#3b82f6',
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  providerInput: {
    flex: 1,
    height: 42,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#0f172a',
  },
  updateButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 8,
  },
  updateButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonDisabled: {
    backgroundColor: '#94a3b8',
    opacity: 0.6,
  },
  // Style cho phần ProfileScreen (Bài 3)
  profileBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    marginBottom: 20,
  },
  profileSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  profileContent: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 14,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#3b82f6',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#22c55e',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  greetingText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
    textAlign: 'center',
  },
  emailText: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 18,
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  loggedOutContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  loggedOutIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  loggedOutTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 4,
  },
  loggedOutSub: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  loginButton: {
    backgroundColor: '#10b981',
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 8,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  errorText: {
    color: '#dc2626',
    textAlign: 'center',
  },
  // Style cho bài 2 (Switch / useEffect)
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
  // Style giải thích chung
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
  // Style cho bài 1 (useState)
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
