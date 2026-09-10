import React, {
  useState,
  useEffect,
  useContext,
  useReducer,
  useMemo,
  useCallback,
  useRef,
} from 'react';
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
  FlatList,
} from 'react-native';
// Câu hỏi mở rộng bài 3: Nhập UserContext, UserProvider, useUser từ tệp riêng biệt
import {
  UserContext,
  UserProvider,
  useUser,
  defaultUserData,
} from '../context/UserContext';

export default function Index() {
  const [activeTab, setActiveTab] = useState<
    'memo' | 'reducer' | 'context' | 'connection' | 'state'
  >('memo');

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
            style={[styles.tabButton, activeTab === 'memo' && styles.tabButtonActive]}
            onPress={() => setActiveTab('memo')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === 'memo' && styles.tabButtonTextActive,
              ]}
            >
              Bài 5: useMemo & useCallback
            </Text>
          </TouchableOpacity>

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
      {activeTab === 'memo' && <MemoExercise />}
      {activeTab === 'reducer' && <ReducerExercise />}
      {activeTab === 'context' && <ContextExercise />}
      {activeTab === 'connection' && <ConnectionExercise />}
      {activeTab === 'state' && <ProfileExercise />}
    </View>
  );
}

// ============================================================================
// BÀI TẬP 5: TÌM KIẾM VÀ TÍNH TỔNG SẢN PHẨM (useMemo, useCallback & React.memo)
// ============================================================================

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

// Bước 1: Danh sách sản phẩm được khai báo ngoài component để tránh tạo array mới sau mỗi lần render
const initialProducts: Product[] = [
  { id: '1', name: 'Áo thun thể thao', price: 200000, category: 'Thời trang' },
  { id: '2', name: 'Quần jean phong cách', price: 450000, category: 'Thời trang' },
  { id: '3', name: 'Giày thể thao chạy bộ', price: 800000, category: 'Giày dép' },
  { id: '4', name: 'Túi đeo chéo canvas', price: 350000, category: 'Phụ kiện' },
  { id: '5', name: 'Mũ lưỡi trai cá tính', price: 150000, category: 'Phụ kiện' },
  { id: '6', name: 'Đồng hồ thông minh Pro', price: 1200000, category: 'Công nghệ' },
];

// Câu hỏi mở rộng 3: Dùng React.memo để tối ưu component hiển thị từng sản phẩm
interface ProductItemProps {
  item: Product;
  onSelect: (product: Product) => void;
  isSelected: boolean;
}

const ProductItem = React.memo(function ProductItem({
  item,
  onSelect,
  isSelected,
}: ProductItemProps) {
  // Câu hỏi mở rộng 4: Theo dõi số lần component con này re-render
  const renderCount = useRef(0);
  renderCount.current += 1;

  return (
    <TouchableOpacity
      style={[styles.productCard, isSelected && styles.productCardSelected]}
      onPress={() => onSelect(item)}
      activeOpacity={0.7}
    >
      <View style={styles.productMain}>
        <View style={styles.productTextGroup}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productCategory}>{item.category}</Text>
        </View>
        <Text style={styles.productPrice}>
          {item.price.toLocaleString('vi-VN')} đ
        </Text>
      </View>

      <View style={styles.productFooter}>
        <View
          style={[
            styles.selectStatusBadge,
            isSelected && styles.selectStatusBadgeActive,
          ]}
        >
          <Text
            style={[
              styles.selectStatusText,
              isSelected && styles.selectStatusTextActive,
            ]}
          >
            {isSelected ? '✓ Đang chọn' : 'Chạm để chọn'}
          </Text>
        </View>

        {/* Badge theo dõi số lần render của component này */}
        <View style={styles.renderCountBadge}>
          <Text style={styles.renderCountText}>
            Render: {renderCount.current} lần
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

function MemoExercise() {
  // Bước 2: Tạo trạng thái từ khóa tìm kiếm
  const [keyword, setKeyword] = useState('');

  // Câu hỏi mở rộng 1: Lựa chọn sắp xếp giá tăng dần hoặc giảm dần
  const [sortOrder, setSortOrder] = useState<'none' | 'asc' | 'desc'>('none');

  // Câu hỏi mở rộng 2: Chỉ hiển thị sản phẩm có giá nhỏ hơn hoặc bằng một mức
  const [maxPrice, setMaxPrice] = useState('');

  // Sản phẩm đang được chọn
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Câu hỏi mở rộng 4: State độc lập để kiểm chứng re-render
  const [dummyCounter, setDummyCounter] = useState(0);
  const parentRenderCount = useRef(0);
  parentRenderCount.current += 1;

  // Bước 3: Dùng useMemo để lọc sản phẩm theo tên, giá tối đa và sắp xếp
  const filteredProducts = useMemo(() => {
    let result = initialProducts.filter((product) =>
      product.name.toLowerCase().includes(keyword.toLowerCase().trim())
    );

    // Câu hỏi mở rộng 2: Lọc theo mức giá tối đa nếu có nhập
    const maxVal = maxPrice.trim() !== '' ? parseFloat(maxPrice) : null;
    if (maxVal !== null && !isNaN(maxVal)) {
      result = result.filter((product) => product.price <= maxVal);
    }

    // Câu hỏi mở rộng 1: Sắp xếp theo giá
    if (sortOrder === 'asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [keyword, maxPrice, sortOrder]);

  // Bước 4: Dùng useMemo để tính tổng giá
  const totalPrice = useMemo(() => {
    return filteredProducts.reduce(
      (total, product) => total + product.price,
      0
    );
  }, [filteredProducts]);

  // Bước 5: Tạo hàm chọn sản phẩm bằng useCallback (giữ nguyên tham chiếu giữa các lần render)
  const handleSelect = useCallback((product: Product) => {
    setSelectedProduct(product);
    console.log('Đã chọn:', product.name);
  }, []);

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
          <Text style={styles.title}>Tìm kiếm và tính tổng sản phẩm</Text>
          <Text style={styles.subtitle}>
            Tối ưu hiệu năng: useMemo, useCallback & React.memo
          </Text>

          {/* Công cụ kiểm chứng Re-render (Câu hỏi mở rộng 4) */}
          <View style={styles.renderMonitorBox}>
            <View style={styles.renderMonitorHeader}>
              <Text style={styles.renderMonitorTitle}>
                🔬 Bộ theo dõi Re-render (Câu hỏi 4)
              </Text>
              <Text style={styles.renderMonitorCounter}>
                Parent render: <Text style={styles.boldText}>{parentRenderCount.current}</Text> lần
              </Text>
            </View>
            <Text style={styles.renderMonitorSub}>
              Nhấn nút dưới để kích hoạt re-render màn hình cha. Nhờ <Text style={styles.codeText}>React.memo</Text> & <Text style={styles.codeText}>useCallback</Text>, các thẻ sản phẩm bên dưới <Text style={styles.boldText}>không bị re-render lại</Text>!
            </Text>
            <TouchableOpacity
              style={styles.triggerRenderBtn}
              onPress={() => setDummyCounter((prev) => prev + 1)}
              activeOpacity={0.8}
            >
              <Text style={styles.triggerRenderBtnText}>
                🔄 Kích hoạt Re-render Component Cha (Counter: {dummyCounter})
              </Text>
            </TouchableOpacity>
          </View>

          {/* Bộ lọc tìm kiếm */}
          <View style={styles.filterSection}>
            {/* Bước 2: Ô nhập từ khóa tìm kiếm */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>🔍 Tìm kiếm theo tên sản phẩm:</Text>
              <TextInput
                style={styles.input}
                value={keyword}
                onChangeText={setKeyword}
                placeholder="Nhập tên sản phẩm (vd: Áo, Giày, Mũ...)"
                placeholderTextColor="#94a3b8"
              />
            </View>

            {/* Câu hỏi mở rộng 2: Lọc sản phẩm có giá nhỏ hơn mức do người dùng nhập */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>💵 Lọc giá tối đa (VNĐ):</Text>
              <TextInput
                style={styles.input}
                value={maxPrice}
                onChangeText={(text) => setMaxPrice(text.replace(/[^0-9]/g, ''))}
                placeholder="Nhập mức giá tối đa (vd: 500000)"
                placeholderTextColor="#94a3b8"
                keyboardType="numeric"
              />
            </View>

            {/* Câu hỏi mở rộng 1: Lựa chọn sắp xếp giá tăng dần / giảm dần */}
            <View style={styles.sortSection}>
              <Text style={styles.label}>⚡ Sắp xếp theo giá:</Text>
              <View style={styles.sortButtonsRow}>
                <TouchableOpacity
                  style={[
                    styles.sortBtn,
                    sortOrder === 'none' && styles.sortBtnActive,
                  ]}
                  onPress={() => setSortOrder('none')}
                >
                  <Text
                    style={[
                      styles.sortBtnText,
                      sortOrder === 'none' && styles.sortBtnTextActive,
                    ]}
                  >
                    Mặc định
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.sortBtn,
                    sortOrder === 'asc' && styles.sortBtnActive,
                  ]}
                  onPress={() => setSortOrder('asc')}
                >
                  <Text
                    style={[
                      styles.sortBtnText,
                      sortOrder === 'asc' && styles.sortBtnTextActive,
                    ]}
                  >
                    Giá tăng dần ↑
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.sortBtn,
                    sortOrder === 'desc' && styles.sortBtnActive,
                  ]}
                  onPress={() => setSortOrder('desc')}
                >
                  <Text
                    style={[
                      styles.sortBtnText,
                      sortOrder === 'desc' && styles.sortBtnTextActive,
                    ]}
                  >
                    Giá giảm dần ↓
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Bước 7: Hiển thị tổng giá */}
          <View style={styles.totalPriceCard}>
            <View>
              <Text style={styles.totalPriceLabel}>Tổng giá các sản phẩm:</Text>
              <Text style={styles.totalPriceSub}>
                Hiển thị {filteredProducts.length} / {initialProducts.length} sản phẩm
              </Text>
            </View>
            <Text style={styles.totalPriceValue}>
              {totalPrice.toLocaleString('vi-VN')} đ
            </Text>
          </View>

          {/* Sản phẩm đang được chọn */}
          {selectedProduct ? (
            <View style={styles.selectedBox}>
              <Text style={styles.selectedTitle}>
                Đang chọn: <Text style={styles.boldText}>{selectedProduct.name}</Text> ({selectedProduct.price.toLocaleString('vi-VN')} đ)
              </Text>
            </View>
          ) : null}

          {/* Bước 6: Hiển thị danh sách bằng FlatList */}
          <Text style={styles.listHeader}>Danh sách sản phẩm:</Text>
          {filteredProducts.length > 0 ? (
            <FlatList
              data={filteredProducts}
              keyExtractor={(item) => item.id}
              scrollEnabled={false} // Cuộn theo ScrollView bên ngoài
              renderItem={({ item }) => (
                <ProductItem
                  item={item}
                  onSelect={handleSelect}
                  isSelected={selectedProduct?.id === item.id}
                />
              )}
            />
          ) : (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>
                Không có sản phẩm nào phù hợp với bộ lọc hiện tại.
              </Text>
            </View>
          )}

          {/* Hộp phân tích và giải thích 4 câu hỏi mở rộng */}
          <View style={styles.explanationBox}>
            <Text style={styles.explanationTitle}>
              💡 Giải thích chi tiết các kỹ thuật tối ưu hóa
            </Text>
            <Text style={styles.explanationText}>
              • <Text style={styles.boldText}>useMemo lọc & tính tổng (Bước 3 & 4):</Text>{' '}
              Chỉ tính toán lại khi <Text style={styles.codeText}>keyword</Text>,{' '}
              <Text style={styles.codeText}>maxPrice</Text> hoặc{' '}
              <Text style={styles.codeText}>sortOrder</Text> thay đổi. Các re-render từ biến khác không làm tốn chi phí duyệt mảng.
            </Text>
            <Text style={[styles.explanationText, { marginTop: 6 }]}>
              • <Text style={styles.boldText}>useCallback cho handleSelect (Bước 5):</Text>{' '}
              Giúp hàm không bị tạo lại tham chiếu mới sau mỗi lần component render, đảm bảo prop{' '}
              <Text style={styles.codeText}>onSelect</Text> truyền xuống con luôn ổn định.
            </Text>
            <Text style={[styles.explanationText, { marginTop: 6 }]}>
              • <Text style={styles.boldText}>React.memo cho ProductItem (Câu hỏi 3):</Text>{' '}
              So sánh nông (shallow compare) các props <Text style={styles.codeText}>item</Text>,{' '}
              <Text style={styles.codeText}>onSelect</Text>,{' '}
              <Text style={styles.codeText}>isSelected</Text>. Nếu props không đổi, React bỏ qua việc render lại component con.
            </Text>
            <Text style={[styles.explanationText, { marginTop: 6 }]}>
              • <Text style={styles.boldText}>So sánh trước và sau khi tối ưu (Câu hỏi 4):</Text>{' '}
              Khi chưa dùng <Text style={styles.codeText}>React.memo</Text> + <Text style={styles.codeText}>useCallback</Text>, mỗi khi gõ phím hoặc đổi state cha, toàn bộ item đều bị render lại. Sau khi tối ưu, số lần render của từng item được giữ nguyên (quan sát badge <Text style={styles.codeText}>Render: N lần</Text> ở mỗi thẻ).
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ============================================================================
// BÀI TẬP 4: QUẢN LÝ FORM ĐĂNG NHẬP (useReducer)
// ============================================================================

interface FormState {
  email: string;
  password: string;
  error: string;
  isSubmitting: boolean;
  successMessage: string;
}

type FormAction =
  | { type: 'SET_EMAIL'; payload: string }
  | { type: 'SET_PASSWORD'; payload: string }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'START_SUBMIT' }
  | { type: 'SUBMIT_SUCCESS'; payload: string }
  | { type: 'RESET' };

const initialFormState: FormState = {
  email: '',
  password: '',
  error: '',
  isSubmitting: false,
  successMessage: '',
};

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
  const [state, dispatch] = useReducer(formReducer, initialFormState);

  const handleLogin = () => {
    if (!state.email.trim() || !state.password.trim()) {
      dispatch({
        type: 'SET_ERROR',
        payload: 'Vui lòng nhập đầy đủ thông tin',
      });
      return;
    }

    if (!state.email.includes('@')) {
      dispatch({
        type: 'SET_ERROR',
        payload: 'Email không hợp lệ (phải chứa ký tự @)',
      });
      return;
    }

    if (state.password.length < 6) {
      dispatch({
        type: 'SET_ERROR',
        payload: 'Mật khẩu phải có ít nhất 6 ký tự',
      });
      return;
    }

    dispatch({ type: 'START_SUBMIT' });

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

          <View style={styles.formContainer}>
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

            {state.error ? (
              <View style={styles.formErrorBox}>
                <Text style={styles.formErrorText}>⚠️ {state.error}</Text>
              </View>
            ) : null}

            {state.successMessage ? (
              <View style={styles.formSuccessBox}>
                <Text style={styles.formSuccessText}>🎉 {state.successMessage}</Text>
              </View>
            ) : null}

            <View style={styles.buttonGroup}>
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
          <Text style={styles.controlHeader}>⚙️ Thay đổi giá trị ở cấp Provider</Text>
          <Text style={styles.controlSub}>
            Nhập tên mới để thấy ProfileScreen tự động cập nhật mà không cần props:
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
                  styles.profileGreetingText,
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
    maxWidth: 540,
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
  // Style cho Bộ theo dõi Re-render (Bài 5)
  renderMonitorBox: {
    backgroundColor: '#fdf4ff',
    borderWidth: 1,
    borderColor: '#f0abfc',
    borderRadius: 12,
    padding: 14,
    marginBottom: 18,
  },
  renderMonitorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  renderMonitorTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#86198f',
  },
  renderMonitorCounter: {
    fontSize: 12,
    color: '#a21caf',
  },
  renderMonitorSub: {
    fontSize: 12,
    color: '#701a75',
    lineHeight: 18,
    marginBottom: 10,
  },
  triggerRenderBtn: {
    backgroundColor: '#a21caf',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  triggerRenderBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  // Filter section
  filterSection: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  sortSection: {
    marginTop: 4,
  },
  sortButtonsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  sortBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    alignItems: 'center',
  },
  sortBtnActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  sortBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  sortBtnTextActive: {
    color: '#ffffff',
  },
  // Thẻ tổng giá
  totalPriceCard: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1.5,
    borderColor: '#86efac',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  totalPriceLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#166534',
  },
  totalPriceSub: {
    fontSize: 12,
    color: '#15803d',
    marginTop: 2,
  },
  totalPriceValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#15803d',
  },
  selectedBox: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
  },
  selectedTitle: {
    fontSize: 13,
    color: '#1e40af',
  },
  listHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 10,
  },
  // Product item card
  productCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  productCardSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#f0f7ff',
  },
  productMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  productTextGroup: {
    flex: 1,
    marginRight: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 2,
  },
  productCategory: {
    fontSize: 12,
    color: '#64748b',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2563eb',
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  selectStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#f1f5f9',
  },
  selectStatusBadgeActive: {
    backgroundColor: '#2563eb',
  },
  selectStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  selectStatusTextActive: {
    color: '#ffffff',
  },
  renderCountBadge: {
    backgroundColor: '#fdf4ff',
    borderWidth: 1,
    borderColor: '#f0abfc',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  renderCountText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#a21caf',
  },
  emptyBox: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#94a3b8',
    fontStyle: 'italic',
    textAlign: 'center',
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
    marginTop: 16,
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
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    height: 46,
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#0f172a',
    backgroundColor: '#ffffff',
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
  profileGreetingText: {
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
