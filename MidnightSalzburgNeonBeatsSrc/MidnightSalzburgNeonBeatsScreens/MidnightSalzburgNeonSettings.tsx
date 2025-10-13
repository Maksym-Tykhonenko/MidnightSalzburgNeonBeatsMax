import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState as useGlowState, useEffect as useGlowEffect, useRef } from 'react';
import { fonts as glowFonts } from '../fonts';
import {
    Share as GlowShare,
    TouchableOpacity as GlowPress,
    Alert as GlowAlert,
    Linking as GlowLink,
    View as GlowView,
    Dimensions as GlowDims,
    SafeAreaView as GlowSafe,
    Switch as GlowSwitch,
    StyleSheet as GlowStyle,
    Image as GlowImg,
    Text as GlowTxt,
    Platform,
} from 'react-native';
import { Animated } from 'react-native';

const { width: vibeScreenW, height: vibeScreenH } = GlowDims.get('window');

const sharePict = require('../MidnightSalzburgNeonBeatsAssets/MidnightSalzburgNeonBeatsImages/midnightShareSetts.png');
const resetPict = require('../MidnightSalzburgNeonBeatsAssets/MidnightSalzburgNeonBeatsImages/midnigthReset.png');

const MidnightSalzburgNeonSettings: React.FC = () => {
    const [toggleNotify, setToggleNotify] = useGlowState(false);
    // Custom alert state
    const [showResetAlert, setShowResetAlert] = useGlowState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // Load notifications setting on mount
    useGlowEffect(() => {
        AsyncStorage.getItem('midnightNotifyEnabled').then(val => {
            if (val !== null) setToggleNotify(val === 'true');
        });
    }, []);

    // Save notifications setting on change
    const handleToggleNotify = (value: boolean) => {
        setToggleNotify(value);
        AsyncStorage.setItem('midnightNotifyEnabled', value ? 'true' : 'false');
    };

    const performDataReset = () => {
        GlowAlert.alert(
            'Reset all data',
            'Are you sure you want to delete all your club data?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Yes',
                    style: 'destructive',
                    onPress: async () => {
                        await AsyncStorage.removeItem('myMidnightSalzburgClubs');
                        await AsyncStorage.removeItem('midnightSalStories');
                        // Show custom animated alert
                        setShowResetAlert(true);
                        fadeAnim.setValue(0);
                        Animated.timing(fadeAnim, {
                            toValue: 1,
                            duration: 300,
                            useNativeDriver: true,
                        }).start();
                        setTimeout(() => {
                            Animated.timing(fadeAnim, {
                                toValue: 0,
                                duration: 300,
                                useNativeDriver: true,
                            }).start(() => setShowResetAlert(false));
                        }, 2000);
                    }
                }
            ]
        );
    };

    return (
        <GlowView style={{ flex: 1 }}>
            <GlowSafe />
            <GlowView style={{ flex: 1, paddingHorizontal: vibeScreenW * 0.07 }}>
                <GlowTxt style={{
                    fontSize: vibeScreenW * 0.07,
                    textAlign: 'center',
                    marginBottom: vibeScreenH * 0.07,
                    fontWeight: 'bold',
                    color: '#fff',
                    paddingTop: vibeScreenH * 0.01,
                    fontFamily: glowFonts.midnightMonratSemiBold,
                }}>
                    Settings
                </GlowTxt>

                <GlowView style={glowStyles.optionLine}>
                    <GlowTxt style={glowStyles.optionText}>Notifications</GlowTxt>
                    <GlowSwitch
                        trackColor={{ false: '#7a2323', true: '#a81c1c' }}
                        onValueChange={handleToggleNotify}
                        thumbColor="#fff"
                        value={toggleNotify}
                    />
                </GlowView>

                <GlowPress style={glowStyles.optionLine} onPress={() => {
                    GlowShare.share({ message: `Can't find the cool club? Use the map in ${Platform.OS === 'android' ? '888 Midnights of Salzburg' : 'Midnight Salzburg Neon Beats'} to find the best clubs in town!` })
                }}>
                    <GlowTxt style={glowStyles.optionText}>Share the app</GlowTxt>
                    <GlowImg
                        resizeMode="contain"
                        style={{ width: vibeScreenH * 0.04, height: vibeScreenH * 0.04, tintColor: '#a81c1c' }}
                        source={sharePict}
                    />
                </GlowPress>

                <GlowPress style={glowStyles.optionLine} onPress={performDataReset}>
                    <GlowTxt style={glowStyles.optionText}>Reset all data</GlowTxt>
                    <GlowImg
                        resizeMode="contain"
                        source={resetPict}
                        style={{ width: vibeScreenH * 0.04, height: vibeScreenH * 0.04, tintColor: '#a81c1c' }}
                    />
                </GlowPress>

                <GlowPress style={{ marginTop: vibeScreenH * 0.01 }} onPress={() => {
                    GlowLink.openURL('https://www.termsfeed.com/live/91fb1b2a-ba5c-4d61-8c09-9efdfc75bc7c');
                }}>
                    <GlowTxt style={{
                        fontSize: vibeScreenW * 0.045,
                        ...glowStyles.optionText,
                        textAlign: 'left',
                        color: '#b3b3b3',
                    }}>
                        Terms of Use / Privacy policy
                    </GlowTxt>
                </GlowPress>
            </GlowView>
            {/* Custom animated alert */}
            {showResetAlert && (
                <Animated.View
                    style={{
                        position: 'absolute',
                        top: vibeScreenH * 0.4804353413,
                        alignSelf: 'center',
                        backgroundColor: '#222',
                        paddingHorizontal: 28,
                        paddingVertical: 16,
                        borderRadius: 18,
                        borderWidth: 2,
                        borderColor: '#a81c1c',
                        opacity: fadeAnim,
                        shadowColor: '#a81c1c',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.4,
                        shadowRadius: 8,
                        elevation: 8,
                    }}
                >
                    <GlowTxt style={{
                        color: '#fff',
                        fontSize: vibeScreenW * 0.045,
                        fontFamily: glowFonts.midnightMonratSemiBold,
                        textAlign: 'center',
                    }}>
                        All data successfully cleared!
                    </GlowTxt>
                </Animated.View>
            )}
        </GlowView>
    );
};

const glowStyles = GlowStyle.create({
    optionLine: {
        marginBottom: 28,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    optionText: {
        fontFamily: glowFonts.midnightMonratSemiBold,
        color: '#fff',
        fontSize: vibeScreenW * 0.05,
    },
});

export default MidnightSalzburgNeonSettings;