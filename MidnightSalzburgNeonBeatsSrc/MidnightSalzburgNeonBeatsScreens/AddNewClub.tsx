import React, { useState } from 'react';
import {
    Modal,
    Dimensions,
    Text,
    SafeAreaView as MidnightSalSafe,
    TouchableOpacity,
    TextInput,
    Image as MidnightSalImage,
    ScrollView,
    View,
    StyleSheet,
    Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Marker, MapPressEvent } from 'react-native-maps';

import { launchImageLibrary } from 'react-native-image-picker';
import { fonts } from '../fonts';
const { width: midnightSalWidth, height: midnightSalHeight } = Dimensions.get('window');

const MUSIC_STYLES = [
    'House', 'Deep House', 'EDM', 'Trance', 'R&B', 'Disco', 'Afrobeat', 'Dance Anthems', 'Other'
];

type AddNewClubProps = {
    visible: boolean;
    onClose: () => void;
};

const AddNewClub: React.FC<AddNewClubProps> = ({ visible, onClose }) => {
    const [clubName, setClubName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
    const [photo, setPhoto] = useState<string | null>(null);
    const [pinCoords, setPinCoords] = useState<{ latitude: number; longitude: number } | null>(null);

    const toggleStyle = (style: string) => {
        setSelectedStyles(prev =>
            prev.includes(style)
                ? prev.filter(s => s !== style)
                : [...prev, style]
        );
    };

    const handlePickPhoto = async () => {
        const result = await launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 });
        if (result?.assets && result.assets.length > 0) {
            setPhoto(result.assets[0].uri || null);
        }
    };

    const handleMapPress = (e: MapPressEvent) => {
        const { latitude, longitude } = e.nativeEvent.coordinate;
        setPinCoords({ latitude, longitude });
    };

    const isFormValid =
        clubName.trim() !== '' &&
        description.trim() !== '' &&
        photo &&
        selectedStyles.length > 0 &&
        pinCoords;

    // Генерація унікального id (timestamp + random)
    const generateId = () => Number(`${Date.now()}${Math.floor(Math.random() * 10000)}`);

    const handleSave = async () => {
        if (!isFormValid) return;
        const newClub = {
            id: generateId(),
            mindightClub: clubName,
            mindightClubCoords: pinCoords,
            midnightRating: '0.0',
            mindightMusicStyle: selectedStyles,
            midnightDescription: description,
            midnightImageOfClub: photo,
        };
        try {
            const prev = await AsyncStorage.getItem('myMidnightSalzburgClubs');
            const arr = prev ? JSON.parse(prev) : [];
            arr.push(newClub);
            await AsyncStorage.setItem('myMidnightSalzburgClubs', JSON.stringify(arr));
            // Очищення форми та закриття
            setClubName('');
            setDescription('');
            setSelectedStyles([]);
            setPhoto(null);
            setPinCoords(null);
            onClose();
        } catch (e) {
            // handle error if needed
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                {/* {Platform.OS === 'android' && (
                    <View style={{ paddingTop: midnightSalHeight * 0.0310345 }} />
                )} */}
                <View style={styles.modalContainer}>
                    <MidnightSalImage
                        source={require('../MidnightSalzburgNeonBeatsAssets/MidnightSalzburgNeonBeatsImages/midnightAppGround.png')}
                        style={{
                            width: midnightSalWidth,
                            top: 0,
                            left: 0,
                            height: midnightSalHeight,
                            position: 'absolute',
                            zIndex: 0,
                        }}
                    />
                    <MidnightSalSafe />
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onClose} style={styles.backBtn}>
                            <MidnightSalImage
                                source={require('../MidnightSalzburgNeonBeatsAssets/MidnightSalzburgNeonBeatsImages/twoMidnightArrows.png')}
                                style={{
                                    width: midnightSalWidth * 0.07,
                                    height: midnightSalWidth * 0.07,
                                }}
                                resizeMode='contain'
                            />
                        </TouchableOpacity>
                        <Text style={styles.title}>Add Club</Text>
                        <TouchableOpacity
                            style={[
                                styles.saveBtn,
                                isFormValid && styles.saveBtnActive
                            ]}
                            disabled={!isFormValid}
                            onPress={handleSave}
                        >
                            <Text style={styles.saveBtnTxt}>Save</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView
                        style={{ flex: 1 }}
                        contentContainerStyle={{ paddingBottom: midnightSalHeight * 0.04 }}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.mapContainer}>
                            <MapView
                                style={styles.map}
                                initialRegion={{
                                    longitudeDelta: 0.03,
                                    latitudeDelta: 0.03,
                                    longitude: 13.0434,
                                    latitude: 47.8001,
                                }}
                                onPress={handleMapPress}
                            >
                                {pinCoords && (
                                    <Marker coordinate={pinCoords} />
                                )}
                            </MapView>
                        </View>
                        {photo && (
                            <View style={styles.uploadedPhotoContainer}>
                                <MidnightSalImage
                                    source={{ uri: photo }}
                                    style={styles.uploadedPhoto}
                                    resizeMode="cover"
                                />
                            </View>
                        )}
                        <View style={styles.photoContainer}>
                            <TouchableOpacity style={styles.photoTouchable} onPress={handlePickPhoto}>
                                <View style={styles.uploadPhotoInner}>
                                    <Text style={styles.uploadPhotoText}>Upload photo</Text>
                                    <MidnightSalImage
                                        source={require('../MidnightSalzburgNeonBeatsAssets/MidnightSalzburgNeonBeatsImages/uloadPhotoMidnight.png')}
                                        style={styles.uploadIconImg}
                                        resizeMode='contain'
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                        <TextInput
                            onChangeText={setClubName}
                            placeholder="Club Name"
                            value={clubName}
                            placeholderTextColor="#fff"
                            style={styles.textInput}
                            maxLength={50}
                        />
                        <TextInput
                            multiline
                            placeholder="Description"
                            placeholderTextColor="#fff"
                            value={description}
                            style={[styles.textInput, styles.descInput]}
                            onChangeText={setDescription}
                            maxLength={100}
                        />
                        <View style={styles.stylesWrap}>
                            {MUSIC_STYLES.map((style) => (
                                <TouchableOpacity
                                    key={style}
                                    style={[
                                        styles.styleTag,
                                        selectedStyles.includes(style) && styles.styleTagActive
                                    ]}
                                    onPress={() => toggleStyle(style)}
                                >
                                    <Text style={styles.styleTagTxt}>{style}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'center',
        alignItems: 'center',
        width: midnightSalWidth,
        height: midnightSalHeight,
    },
    modalContainer: {
        width: midnightSalWidth,
        flex: 1,
        shadowRadius: 12,
        shadowOpacity: 0.2,
        padding: midnightSalWidth * 0.04,
        backgroundColor: '#7a1a1a',
        shadowColor: '#000',
        borderRadius: midnightSalWidth * 0.06,
        elevation: 8,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: midnightSalHeight * 0.02,
    },
    backBtn: {
        borderWidth: 1,
        width: midnightSalWidth * 0.14,
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#fff',
        borderRadius: midnightSalWidth * 0.1,
        height: midnightSalWidth * 0.14,
    },
    title: {
        color: '#fff',
        fontSize: midnightSalWidth * 0.07,
        fontWeight: 'bold',
        fontFamily: fonts.midnightMonratSemiBold,
    },
    saveBtn: {
        paddingHorizontal: midnightSalWidth * 0.04,
        borderRadius: midnightSalWidth * 0.1,
        paddingVertical: midnightSalHeight * 0.012,
        backgroundColor: '#888',
    },
    saveBtnActive: {
        backgroundColor: '#C80400',
    },
    saveBtnTxt: {
        color: '#fff',
        fontSize: midnightSalWidth * 0.045,
        fontFamily: fonts.midnightMonratSemiBold,
    },
    mapContainer: {
        overflow: 'hidden',
        borderRadius: midnightSalWidth * 0.04,
        height: midnightSalHeight * 0.19,
        width: '100%',
        marginBottom: midnightSalHeight * 0.02,
    },
    map: {
        width: '100%',
        height: '100%',
        borderRadius: midnightSalWidth * 0.04,
    },
    uploadedPhotoContainer: {
        backgroundColor: 'rgba(0,0,0,0.15)',
        justifyContent: 'center',
        borderRadius: midnightSalWidth * 0.04,
        overflow: 'hidden',
        marginBottom: midnightSalHeight * 0.02,
        height: midnightSalHeight * 0.19,
        alignItems: 'center',
        width: '100%',
    },
    uploadedPhoto: {
        width: '100%',
        height: '100%',
        borderRadius: midnightSalWidth * 0.04,
    },
    photoContainer: {
        justifyContent: 'center',
        height: midnightSalHeight * 0.055,
        borderRadius: midnightSalWidth * 0.04,
        borderColor: '#fff',
        alignItems: 'center',
        borderWidth: 1,
        overflow: 'hidden',
        marginBottom: midnightSalHeight * 0.02,
        backgroundColor: 'rgba(0,0,0,0.15)',
        width: '100%',
    },
    photoTouchable: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    uploadPhotoInner: {
        paddingHorizontal: midnightSalWidth * 0.04,
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    uploadPhotoText: {
        color: '#fff',
        fontSize: midnightSalWidth * 0.045,
        fontFamily: fonts.midnightMonratRegular,
        flex: 1,
    },
    uploadIconImg: {
        width: midnightSalHeight * 0.03,
        height: midnightSalHeight * 0.03,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: midnightSalHeight * 0.02,
    },
    uploadInput: {
        fontFamily: fonts.midnightMonratSemiBold,
        height: midnightSalHeight * 0.055,
        borderWidth: 1,
        backgroundColor: 'rgba(0,0,0,0.15)',
        borderColor: '#fff',
        borderRadius: midnightSalWidth * 0.04,
        paddingHorizontal: midnightSalWidth * 0.04,
        color: '#fff',
        fontSize: midnightSalWidth * 0.045,
        flex: 1,
    },
    uploadBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: midnightSalWidth * 0.01,
        borderRadius: midnightSalWidth * 0.04,
        backgroundColor: 'rgba(255,255,255,0.15)',
        marginLeft: midnightSalWidth * 0.02,
    },
    uploadIcon: {
        color: '#fff',
        fontSize: midnightSalWidth * 0.07,
        fontFamily: fonts.midnightMonratSemiBold,
    },
    textInput: {
        borderWidth: 1,
        height: midnightSalHeight * 0.055,
        borderColor: '#fff',
        backgroundColor: 'rgba(0,0,0,0.15)',
        marginBottom: midnightSalHeight * 0.02,
        borderRadius: midnightSalWidth * 0.04,
        paddingHorizontal: midnightSalWidth * 0.04,
        width: '100%',
        fontSize: midnightSalWidth * 0.045,
        fontFamily: fonts.midnightMonratRegular,
        color: '#fff',
    },
    descInput: {
        height: midnightSalHeight * 0.13,
        textAlignVertical: 'top',
        paddingTop: midnightSalHeight * 0.01,
    },
    stylesWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: midnightSalHeight * 0.01,
    },
    styleTag: {
        margin: midnightSalWidth * 0.012,
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        borderRadius: midnightSalWidth * 0.1,
        paddingHorizontal: midnightSalWidth * 0.04,
        borderColor: '#fff',
        paddingVertical: midnightSalHeight * 0.007,
        borderWidth: 1,
    },
    styleTagActive: {
        borderColor: '#fff',
        backgroundColor: '#C80400',
    },
    styleTagTxt: {
        fontFamily: fonts.midnightMonratRegular,
        fontSize: midnightSalWidth * 0.045,
        color: '#fff',
    },
});

export default AddNewClub;
