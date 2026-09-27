import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, TouchableOpacity, Dimensions, TextInput, Modal, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import api from '../services/api';

const { width, height } = Dimensions.get('window');

export default function AdminProductsScreen() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // New Product State
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', stock: '' });
  
  // Animations
  const itemTranslateX = useRef(new Animated.Value(0)).current; // Simplified for dynamic list
  const fabScale = useRef(new Animated.Value(1)).current;
  const modalScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/products');
      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (error) {
      console.log('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setModalVisible(true);
    Animated.spring(modalScale, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(modalScale, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  const handleFabPressIn = () => Animated.spring(fabScale, { toValue: 0.8, useNativeDriver: true }).start();
  const handleFabPressOut = () => Animated.spring(fabScale, { toValue: 1, friction: 3, useNativeDriver: true }).start();

  const handleSaveProduct = async () => {
    if (!newProduct.name || !newProduct.price) {
      Alert.alert('Error', 'Name and Price are required');
      return;
    }
    try {
      const res = await api.post('/products', {
        ...newProduct,
        price: Number(newProduct.price),
        stock: Number(newProduct.stock) || 0
      });
      if (res.data.success) {
        closeModal();
        setNewProduct({ name: '', description: '', price: '', stock: '' });
        fetchProducts();
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to add product');
    }
  };

  const handleRemoveProduct = (id) => {
    Alert.alert('Delete Product', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          await api.delete(`/products/${id}`);
          fetchProducts();
        } catch (e) {
          Alert.alert('Error', 'Failed to delete product');
        }
      }}
    ]);
  };

  const filteredProducts = products.filter(p => p.name?.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Inventory</Text>
          <Text style={styles.subtitle}>Manage AC Products</Text>
        </View>
        <TouchableOpacity style={styles.filterBtn}>
          <Ionicons name="filter" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput 
          style={styles.searchInput}
          placeholder="Search products..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
        ) : (
          filteredProducts.map((product, index) => (
            <Animated.View 
              key={product._id} 
              style={[styles.productCard]}
            >
              {/* Image Thumbnail */}
              <View style={[styles.imagePlaceholder, { backgroundColor: '#E0E7FF' }]}>
                <Ionicons name="cube-outline" size={32} color={colors.primary} />
              </View>

              <View style={styles.productInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <TouchableOpacity onPress={() => handleRemoveProduct(product._id)}>
                    <Ionicons name="trash-outline" size={20} color="#FF4757" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.productType}>{product.description || 'No description'}</Text>
                
                <View style={styles.bottomRow}>
                  <Text style={styles.productPrice}>Rs {product.price}</Text>
                  <View style={[styles.stockBadge, product.stock === 0 && styles.outOfStockBadge]}>
                    <Text style={[styles.stockText, product.stock === 0 && styles.outOfStockText]}>
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                    </Text>
                  </View>
                </View>
              </View>
            </Animated.View>
          ))
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        activeOpacity={0.9}
        onPressIn={handleFabPressIn}
        onPressOut={handleFabPressOut}
        onPress={openModal}
        style={styles.fabContainer}
      >
        <Animated.View style={[styles.fab, { transform: [{ scale: fabScale }] }]}>
          <Ionicons name="add" size={28} color="#FFF" />
        </Animated.View>
      </TouchableOpacity>

      {/* Add Product Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <Animated.View style={[styles.modalContent, { transform: [{ scale: modalScale }] }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New AC</Text>
              <TouchableOpacity onPress={closeModal}>
                <Ionicons name="close" size={24} color="#888" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Product Name</Text>
              <TextInput 
                style={styles.input} 
                placeholder="e.g. PEL Inverter 1.5 Ton" 
                placeholderTextColor="#AAA" 
                value={newProduct.name}
                onChangeText={(t) => setNewProduct({...newProduct, name: t})}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description / Type</Text>
              <TextInput 
                style={styles.input} 
                placeholder="e.g. Floor Stand, Split" 
                placeholderTextColor="#AAA" 
                value={newProduct.description}
                onChangeText={(t) => setNewProduct({...newProduct, description: t})}
              />
            </View>

            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                <Text style={styles.inputLabel}>Price (Rs)</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="150000" 
                  keyboardType="numeric" 
                  placeholderTextColor="#AAA" 
                  value={newProduct.price}
                  onChangeText={(t) => setNewProduct({...newProduct, price: t})}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
                <Text style={styles.inputLabel}>Stock</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="10" 
                  keyboardType="numeric" 
                  placeholderTextColor="#AAA" 
                  value={newProduct.stock}
                  onChangeText={(t) => setNewProduct({...newProduct, stock: t})}
                />
              </View>
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProduct}>
              <Text style={styles.saveBtnText}>Save Product</Text>
            </TouchableOpacity>
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    alignItems: 'center',
  },
  title: {
    color: colors.textPrimary,
    fontSize: 26,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#888',
    fontSize: 14,
    marginTop: 2,
  },
  filterBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    height: 45,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 15,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 3,
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'space-between',
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    flex: 1,
  },
  productType: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.primary,
  },
  stockBadge: {
    backgroundColor: '#E2FBE9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  outOfStockBadge: {
    backgroundColor: '#FFF0F1',
  },
  stockText: {
    fontSize: 12,
    color: '#2F855A',
    fontWeight: 'bold',
  },
  outOfStockText: {
    color: '#FF4757',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 30,
    right: 25,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  inputGroup: {
    marginBottom: 15,
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputLabel: {
    fontSize: 13,
    color: '#555',
    marginBottom: 5,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#F7F9FC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.textPrimary,
  },
  saveBtn: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  saveBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
