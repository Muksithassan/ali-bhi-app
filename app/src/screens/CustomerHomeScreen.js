import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');

const QUICK_ACTIONS = [
  { id: '1', title: 'Request\nService', sub: 'Book a Service', icon: 'wrench', bg: '#F0F8FF', iconColor: '#007BFF' },
  { id: '2', title: 'Get a Quote', sub: 'Quick & Easy', icon: 'file-document-outline', bg: '#F0FFF4', iconColor: '#38A169' },
  { id: '3', title: 'AMC Contracts', sub: 'Hassle Free', icon: 'calendar-check-outline', bg: '#FFF5F5', iconColor: '#E53E3E' },
  { id: '4', title: '24/7\nEmergency', sub: "We're Always Ready", icon: 'car-light-alert', bg: '#FFF0F5', iconColor: '#D53F8C' },
];

const SERVICES_GRID = [
  { id: '1', title: 'AC Repair', imageSource: require('../../assets/products/split_ac.jpg'), color: '#002B5B' },
  { id: '2', title: 'AC Installation', imageSource: require('../../assets/products/ceiling_icon.jpg'), color: '#002B5B' },
  { id: '3', title: 'AC Maintenance', imageSource: require('../../assets/products/pm_icon.jpg'), color: '#002B5B' },
  { id: '4', title: 'HVAC Services', imageSource: require('../../assets/products/hvac_icon.jpg'), color: '#002B5B' },
  { id: '5', title: 'Preventive\nMaintenance', imageSource: require('../../assets/products/electric_icon.jpg'), color: '#002B5B' },
  { id: '6', title: 'AMC\n(Annual)', imageSource: require('../../assets/products/amc_icon.jpg'), color: '#002B5B' },
  { id: '7', title: 'Renovation', imageSource: require('../../assets/products/reno_icon.jpg'), color: '#002B5B' },
  { id: '8', title: 'False Ceiling', imageSource: require('../../assets/products/false_ceiling.jpg'), color: '#002B5B' },
  { id: '9', title: 'Electrical\nMaintenance', imageSource: require('../../assets/products/electric_icon.jpg'), color: '#002B5B' },
  { id: '10', title: 'View All Services', icon: 'view-grid-plus', color: '#007BFF', isBlue: true },
];

const FEATURED_PRODUCTS = [
  { id: '1', title: '1.0 Ton Split AC', desc: 'Inverter Technology', price: '$450', imageSource: require('../../assets/products/split_ac.jpg') },
  { id: '2', title: '1.5 Ton Cassette AC', desc: 'Energy Efficient', price: '$550', imageSource: require('../../assets/products/cassette_ac.jpg') },
  { id: '3', title: '2.0 Ton Floor AC', desc: 'Heavy Duty Cooling', price: '$650', imageSource: require('../../assets/products/floor_ac.jpg') },
];

export default function CustomerHomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header - White Background */}
      <View style={styles.header}>
        <Image 
          source={require('../../assets/acp-logo.png')} 
          style={styles.headerLogo} 
          resizeMode="contain" 
        />

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.bellIcon}>
            <Ionicons name="notifications" size={24} color="#002B5B" />
            <View style={styles.badge}><Text style={styles.badgeText}>3</Text></View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.avatar} onPress={() => navigation.navigate('Profile')}>
            <Ionicons name="person" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Hero Banner */}
        <ImageBackground 
          source={require('../../assets/hero-bg.jpg')} 
          style={styles.heroBanner}
          imageStyle={{ opacity: 0.9 }}
        >
          <View style={styles.heroOverlay}>
            <View style={styles.heroContentLeft}>
              <Text style={styles.heroPreTitle}>COMFORT TODAY{'\n'}A BETTER TOMORROW</Text>
              <Text style={styles.heroTitle}>Professional HVAC &{'\n'}Facility Services</Text>
              <Text style={styles.heroSub}>Reliable Solutions for Residential,{'\n'}Commercial & Corporate Clients</Text>
              
              <View style={styles.heroButtons}>
                <TouchableOpacity style={styles.heroBtnPrimary} onPress={() => navigation.navigate('BookingFlow')}>
                  <MaterialCommunityIcons name="wrench" size={16} color="#FFF" />
                  <Text style={styles.heroBtnPrimaryText}>REQUEST SERVICE</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.heroBtnSecondary} onPress={() => navigation.navigate('Quotes')}>
                  <MaterialCommunityIcons name="file-document-outline" size={16} color="#007BFF" />
                  <Text style={styles.heroBtnSecondaryText}>GET A QUOTE</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.heroFeaturesRight}>
              <View style={styles.featureItem}>
                <Ionicons name="snow" size={16} color="#FFF" />
                <Text style={styles.featureText}>Cooler{'\n'}Spaces</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="leaf" size={16} color="#48BB78" />
                <Text style={styles.featureText}>Healthier{'\n'}Environments</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="leaf" size={16} color="#48BB78" />
                <Text style={styles.featureText}>Greener{'\n'}Tomorrow</Text>
              </View>
            </View>
          </View>
        </ImageBackground>

        {/* Quick Actions */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickActionsScroll}>
          {QUICK_ACTIONS.map(action => (
            <TouchableOpacity 
              key={action.id} 
              style={[styles.quickActionCard, { backgroundColor: action.bg }]}
              onPress={() => {
                if(action.id === '1') navigation.navigate('BookingFlow');
                else if(action.id === '2') navigation.navigate('Quotes');
              }}
            >
              <View style={styles.quickActionHeader}>
                <View style={[styles.quickActionIconWrapper, { backgroundColor: '#FFF' }]}>
                  <MaterialCommunityIcons name={action.icon} size={24} color={action.iconColor} />
                </View>
                <Ionicons name="chevron-forward" size={16} color="#888" />
              </View>
              <Text style={styles.quickActionTitle}>{action.title}</Text>
              <Text style={styles.quickActionSub}>{action.sub}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Our Services Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Our Services</Text>
          <Text style={styles.sectionSubtitle}>Expert Solutions for a Comfortable Tomorrow</Text>
        </View>

        <View style={styles.servicesGrid}>
          {SERVICES_GRID.map((service) => (
            <TouchableOpacity 
              key={service.id} 
              style={[styles.serviceGridItem, service.isBlue && styles.serviceGridItemBlue]}
              onPress={() => {
                if(service.isBlue) {
                  navigation.navigate('Services');
                } else {
                  navigation.navigate('BookingFlow', { service: service.title });
                }
              }}
            >
              {service.imageSource ? (
                <Image source={service.imageSource} style={styles.serviceGridImage} />
              ) : (
                <MaterialCommunityIcons 
                  name={service.icon} 
                  size={30} 
                  color={service.isBlue ? '#007BFF' : '#002B5B'} 
                  style={styles.serviceGridIcon}
                />
              )}
              <Text style={[styles.serviceGridText, service.isBlue && { color: '#007BFF' }]}>
                {service.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Promotional Section - Why Choose Us */}
        <View style={styles.promoSection}>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=800' }} style={styles.promoImage} />
          <View style={styles.promoOverlay}>
            <Text style={styles.promoTitle}>Why Choose ACP?</Text>
            <View style={styles.promoFeatures}>
              <View style={styles.promoFeatureItem}>
                <Ionicons name="checkmark-circle" size={16} color="#48BB78" />
                <Text style={styles.promoFeatureText}>Certified Techs</Text>
              </View>
              <View style={styles.promoFeatureItem}>
                <Ionicons name="checkmark-circle" size={16} color="#48BB78" />
                <Text style={styles.promoFeatureText}>24/7 Support</Text>
              </View>
              <View style={styles.promoFeatureItem}>
                <Ionicons name="checkmark-circle" size={16} color="#48BB78" />
                <Text style={styles.promoFeatureText}>Guaranteed Work</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Featured Products Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Products</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Products')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.productsScroll}>
          {FEATURED_PRODUCTS.map((prod) => (
            <View key={prod.id} style={styles.productCard}>
              <Image source={prod.imageSource} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productTitle}>{prod.title}</Text>
                <Text style={styles.productDesc}>{prod.desc}</Text>
                <View style={styles.productBottomRow}>
                  <Text style={styles.productPrice}>{prod.price}</Text>
                  <TouchableOpacity style={styles.buyBtn} onPress={() => navigation.navigate('Products', { action: 'buy', product: prod })}>
                    <Text style={styles.buyBtnText}>BUY</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Corporate & Facility Management Banner */}
        <View style={styles.corporateBanner}>
          <View style={styles.corporateLeft}>
            <View style={styles.corporateHeaderRow}>
              <FontAwesome5 name="building" size={24} color="#FFF" />
              <Text style={styles.corporateTitle}>Corporate & Facility Management</Text>
            </View>
            <Text style={styles.corporateText}>
              Complete HVAC, Maintenance & Facility Solutions for Businesses and Organizations{'\n'}
              (Banks, Hospitals, Offices, Factories, Government Departments & Commercial).
            </Text>
            <TouchableOpacity style={styles.learnMoreBtn}>
              <Text style={styles.learnMoreText}>LEARN MORE</Text>
              <Ionicons name="chevron-forward" size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
          
          {/* Active Request Card Embedded */}
          <View style={styles.activeRequestCard}>
            <View style={styles.activeReqHeader}>
              <Text style={styles.activeReqTitle}>My Service Request</Text>
              <Text style={styles.viewAllText}>View All</Text>
            </View>
            <Text style={styles.activeReqService}>AC Maintenance - Office</Text>
            <Text style={styles.activeReqId}>Request #ACR-2026-0143</Text>
            
            <View style={styles.progressRow}>
              <View style={styles.progressDotActive} />
              <View style={styles.progressLineActive} />
              <View style={styles.progressDotActive} />
              <View style={styles.progressLinePending} />
              <View style={styles.progressDotPending} />
              <View style={styles.progressLinePending} />
              <View style={styles.progressDotPending} />
            </View>
            <View style={styles.progressLabels}>
              <Text style={styles.progressLabelActive}>Requested</Text>
              <Text style={styles.progressLabelActive}>Technician{'\n'}Assigned</Text>
              <Text style={styles.progressLabelPending}>Work In{'\n'}Progress</Text>
              <Text style={styles.progressLabelPending}>Completed</Text>
            </View>

            <View style={styles.techAssignedRow}>
              <View style={styles.techAvatar}><Ionicons name="person" size={20} color="#002B5B" /></View>
              <View style={styles.techInfo}>
                <Text style={styles.techLabel}>Technician Assigned</Text>
                <Text style={styles.techName}>Asif Khan</Text>
              </View>
              <TouchableOpacity style={styles.callCircle}>
                <Ionicons name="call" size={16} color="#007BFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* AMC Banner */}
        <View style={styles.amcBanner}>
          <MaterialCommunityIcons name="air-conditioner" size={40} color="#002B5B" />
          <View style={styles.amcTextCol}>
            <Text style={styles.amcTitle}>Annual Maintenance Contracts</Text>
            <Text style={styles.amcSub}>Keep Your Systems Running Efficiently All Year Round with Our AMC Plans.</Text>
          </View>
          <TouchableOpacity style={styles.viewAmcBtn}>
            <Text style={styles.viewAmcText}>VIEW AMC</Text>
            <Ionicons name="chevron-forward" size={16} color="#FFF" />
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF', 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 5,
    paddingRight: 15,
    paddingVertical: 10,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerLogo: {
    height: 48,
    width: 170,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bellIcon: {
    marginRight: 15,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF4757',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    backgroundColor: '#F8F9FA',
    flexGrow: 1,
    paddingBottom: 30,
  },
  heroBanner: {
    width: '100%',
    backgroundColor: '#002B5B',
  },
  heroOverlay: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 43, 91, 0.75)',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  heroContentLeft: {
    flex: 1,
    paddingRight: 10,
  },
  heroPreTitle: {
    color: '#A0AEC0',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFF',
    lineHeight: 30,
    marginBottom: 8,
  },
  heroSub: {
    fontSize: 12,
    color: '#E2E8F0',
    lineHeight: 18,
    marginBottom: 20,
  },
  heroButtons: {
    flexDirection: 'row',
  },
  heroBtnPrimary: {
    flexDirection: 'row',
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginRight: 10,
  },
  heroBtnPrimaryText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 11,
    marginLeft: 5,
  },
  heroBtnSecondary: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  heroBtnSecondaryText: {
    color: '#007BFF',
    fontWeight: 'bold',
    fontSize: 11,
    marginLeft: 5,
  },
  heroFeaturesRight: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'flex-end',
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255,255,255,0.2)',
    paddingLeft: 10,
  },
  featureItem: {
    alignItems: 'flex-end',
    marginBottom: 15,
  },
  featureText: {
    color: '#FFF',
    fontSize: 9,
    textAlign: 'right',
    marginTop: 4,
  },
  quickActionsScroll: {
    paddingHorizontal: 15,
    paddingTop: 20,
    paddingBottom: 10,
  },
  quickActionCard: {
    width: 140,
    borderRadius: 15,
    padding: 15,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  quickActionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  quickActionIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  quickActionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#002B5B',
    marginBottom: 5,
  },
  quickActionSub: {
    fontSize: 11,
    color: '#666',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#002B5B',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  productsScroll: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  productCard: {
    width: 200,
    backgroundColor: '#FFF',
    borderRadius: 15,
    marginHorizontal: 5,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  productImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#F8F9FA',
  },
  productInfo: {
    padding: 15,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#002B5B',
    marginBottom: 4,
  },
  productDesc: {
    fontSize: 11,
    color: '#666',
    marginBottom: 10,
  },
  productBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '900',
    color: '#007BFF',
  },
  buyBtn: {
    backgroundColor: '#007BFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  buyBtnText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  serviceGridItem: {
    width: '18%', // To fit 5 in a row if possible, or 4 with more space. The design shows 5 in a row.
    minWidth: 70,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    marginBottom: 15,
    marginHorizontal: '1%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  serviceGridItemBlue: {
    backgroundColor: '#F0F8FF',
    borderColor: '#CCE5FF',
    justifyContent: 'center',
  },
  serviceGridImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginBottom: 8,
  },
  serviceGridIcon: {
    marginBottom: 8,
  },
  serviceGridText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#002B5B',
    textAlign: 'center',
  },
  promoSection: {
    margin: 15,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#002B5B',
  },
  promoImage: {
    width: '100%',
    height: 120,
    opacity: 0.6,
  },
  promoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
    justifyContent: 'center',
  },
  promoTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  promoFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  promoFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    marginBottom: 5,
  },
  promoFeatureText: {
    color: '#FFF',
    fontSize: 11,
    marginLeft: 5,
  },
  corporateBanner: {
    backgroundColor: '#002B5B',
    marginTop: 10,
    paddingTop: 20,
    paddingBottom: 20,
  },
  corporateLeft: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  corporateHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  corporateTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  corporateText: {
    color: '#A0AEC0',
    fontSize: 11,
    lineHeight: 18,
    marginBottom: 15,
  },
  learnMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFF',
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  learnMoreText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
    marginRight: 5,
  },
  activeRequestCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 15,
  },
  activeReqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activeReqTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#002B5B',
  },
  viewAllText: {
    fontSize: 11,
    color: '#007BFF',
    fontWeight: 'bold',
  },
  activeReqService: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  activeReqId: {
    fontSize: 11,
    color: '#888',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  progressDotActive: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007BFF',
  },
  progressDotPending: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E2E8F0',
  },
  progressLineActive: {
    flex: 1,
    height: 3,
    backgroundColor: '#007BFF',
  },
  progressLinePending: {
    flex: 1,
    height: 3,
    backgroundColor: '#E2E8F0',
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  progressLabelActive: {
    fontSize: 9,
    color: '#007BFF',
    fontWeight: 'bold',
    textAlign: 'center',
    width: 50,
  },
  progressLabelPending: {
    fontSize: 9,
    color: '#888',
    textAlign: 'center',
    width: 50,
  },
  techAssignedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  techAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F4F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  techInfo: {
    flex: 1,
  },
  techLabel: {
    fontSize: 10,
    color: '#888',
  },
  techName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#002B5B',
  },
  callCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E6F2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  amcBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
    margin: 20,
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#CCE5FF',
  },
  amcTextCol: {
    flex: 1,
    paddingHorizontal: 15,
  },
  amcTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#002B5B',
  },
  amcSub: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
  },
  viewAmcBtn: {
    flexDirection: 'row',
    backgroundColor: '#007BFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  viewAmcText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
    marginRight: 5,
  }
});
