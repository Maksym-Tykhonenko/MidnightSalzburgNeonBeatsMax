import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState as usePulseState, useEffect as usePulseEffect } from 'react';
import { fonts as pulseFonts } from '../fonts';
import {
    ScrollView,
    Text as PulseTxt,
    Pressable,
    Image as PulseImg,
    View as PulseView,
    Dimensions as PulseDims,
    SafeAreaView as PulseSafe,
    Modal as PulseModal,
    TextInput as PulseInput,
    TouchableOpacity as PulsePress,
    TouchableWithoutFeedback,
    Keyboard,
    Alert as PulseAlert,
    Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import * as ImagePicker from 'react-native-image-picker';
import nightVenues from '../MidnightSalzburgNeonBeatsData/midnightClubs';

const { width: auroraScreenW, height: auroraScreenH } = PulseDims.get('window');

const MidnightSalzburgNeonStories: React.FC = () => {
    const [allStories, setAllStories] = usePulseState<any[]>([]);
    const [storyModalVisible, setStoryModalVisible] = usePulseState(false);

    const [clubChoice, setClubChoice] = usePulseState('');
    const [storyHeading, setStoryHeading] = usePulseState('');
    const [pickedPhotos, setPickedPhotos] = usePulseState<string[]>([]);
    const [clubsDropdown, setClubsDropdown] = usePulseState(false);
    const [clubsList, setClubsList] = usePulseState<string[]>([]);

    usePulseEffect(() => {
        AsyncStorage.getItem('midnightSalStories').then(saved => {
            if (saved) setAllStories(JSON.parse(saved));
        });
        const fetchClubs = async () => {
            const sysClubsRaw = await AsyncStorage.getItem('midnightClubs');
            const userClubsRaw = await AsyncStorage.getItem('myMidnightSalzburgClubs');
            let sysClubs = [];
            let userClubs = [];
            try { sysClubs = sysClubsRaw ? JSON.parse(sysClubsRaw) : []; } catch { sysClubs = []; }
            try { userClubs = userClubsRaw ? JSON.parse(userClubsRaw) : []; } catch { userClubs = []; }
            let importedClubs = [];
            try { importedClubs = Array.isArray(nightVenues) ? nightVenues : []; } catch { importedClubs = []; }
            const namesFromImport = importedClubs.map((c: any) => c.midnightClub || c.mindightClub).filter(Boolean);
            const namesSys = sysClubs.map((c: any) => c.midnightClub || c.mindightClub).filter(Boolean);
            const namesUser = userClubs.map((c: any) => c.midnightClub || c.mindightClub).filter(Boolean);
            const totalNames = [...namesFromImport, ...namesSys, ...namesUser];
            setClubsList(totalNames);
            setClubChoice(totalNames[0] || '');
        };
        fetchClubs();
    }, []);

    const saveStoryHandler = async () => {
        if (!clubChoice || !storyHeading.trim() || pickedPhotos.length === 0) {
            PulseAlert.alert(
                'Missing fields',
                'Please fill in all fields and add at least one photo before saving your story.'
            );
            return;
        }
        const newEntry = { club: clubChoice, title: storyHeading, photos: pickedPhotos };
        const updated = [newEntry, ...allStories];
        setAllStories(updated);
        await AsyncStorage.setItem('midnightSalStories', JSON.stringify(updated));
        setStoryModalVisible(false);
        setStoryHeading('');
        setPickedPhotos([]);
        setClubChoice(clubsList[0] || '');
    };

    const pickPhotoHandler = async () => {
        if (pickedPhotos.length >= 4) return;
        ImagePicker.launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 }, (response) => {
            if (response?.assets && response.assets.length > 0) {
                setPickedPhotos([...pickedPhotos, response.assets[0].uri]);
            }
        });
    };

    const removePhotoHandler = (idx: number) => {
        setPickedPhotos(pickedPhotos.filter((_, i) => i !== idx));
    };

    return (
        <TouchableWithoutFeedback onPress={() => {
            if (clubsDropdown) setClubsDropdown(false);
            Keyboard.dismiss();
        }}>
            <PulseView style={{ flex: 1 }}>
                <PulseSafe />
                <PulseView style={{ flex: 1, paddingHorizontal: auroraScreenW * 0.07 }}>
                    <PulseTxt style={{
                        fontSize: auroraScreenW * 0.07,
                        paddingTop: auroraScreenH * 0.01,
                        marginBottom: auroraScreenH * 0.07,
                        color: '#fff',
                        textAlign: 'center',
                        fontFamily: pulseFonts.midnightMonratSemiBold,
                        fontWeight: 'bold',
                    }}>
                        My {Platform.OS === 'android' ? '888 ' : ''}Midnight Stories
                    </PulseTxt>

                    {allStories.length > 0 && (
                        <PulsePress
                            activeOpacity={0.85}
                            style={{
                                justifyContent: 'center',
                                marginTop: -auroraScreenH * 0.04,
                                alignItems: 'center',
                                height: auroraScreenW * 0.12,
                                marginBottom: auroraScreenH * 0.03,
                                borderRadius: auroraScreenW * 0.06,
                                overflow: 'hidden',
                                width: '100%',
                            }}
                            onPress={() => {
                                setStoryModalVisible(true);
                                setClubsDropdown(false);
                            }}
                        >
                            <LinearGradient
                                end={{ x: 1, y: 0.5 }}
                                start={{ x: 0, y: 0.5 }}
                                colors={['#E40521', '#870813']}
                                style={{
                                    alignItems: 'center',
                                    height: '100%',
                                    borderRadius: auroraScreenW * 0.06,
                                    justifyContent: 'center',
                                    width: '100%',
                                }}
                            >
                                <PulseTxt style={{
                                    fontSize: auroraScreenW * 0.05,
                                    textAlign: 'center',
                                    fontFamily: pulseFonts.midnightMonratSemiBold,
                                    color: '#fff',
                                }}>
                                    Add Story
                                </PulseTxt>
                            </LinearGradient>
                        </PulsePress>
                    )}

                    {allStories.length === 0 ? (
                        <PulseView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <PulseTxt style={{
                                marginBottom: auroraScreenH * 0.03,
                                fontFamily: pulseFonts.midnightMonratSemiBold,
                                fontSize: auroraScreenW * 0.055,
                                textAlign: 'center',
                                color: '#fff',
                            }}>
                                No stories yet. Let the night begin
                            </PulseTxt>
                            <PulsePress
                                style={{
                                    borderWidth: 1,
                                    height: auroraScreenW * 0.16,
                                    borderRadius: auroraScreenW * 0.08,
                                    borderColor: '#fff',
                                    backgroundColor: '#C80400',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: auroraScreenW * 0.16,
                                }}
                                onPress={() => {
                                    setStoryModalVisible(true)
                                    setClubsDropdown(false);
                                }}
                            >
                                <PulseTxt style={{ color: '#fff', fontSize: auroraScreenW * 0.09, fontWeight: 'bold' }}>+</PulseTxt>
                            </PulsePress>
                        </PulseView>
                    ) : (
                        <ScrollView
                            style={{ flex: 1 }}
                            contentContainerStyle={{ paddingBottom: auroraScreenH * 0.1954302}}
                            showsVerticalScrollIndicator={false}
                        >
                            {allStories.map((story, idx) => (
                                <StoryCard
                                    key={idx}
                                    story={story}
                                    auroraScreenW={auroraScreenW}
                                    auroraScreenH={auroraScreenH}
                                    pulseFonts={pulseFonts}
                                />
                            ))}
                        </ScrollView>
                    )}

                    <PulseModal visible={storyModalVisible} animationType="slide" transparent={true}>
                        <PulseImg
                            source={require('../MidnightSalzburgNeonBeatsAssets/MidnightSalzburgNeonBeatsImages/midnightAppGround.png')}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: auroraScreenW,
                                height: auroraScreenH,
                                zIndex: 0,
                            }}
                        />
                        <PulseSafe />
                        <PulseView style={{
                            flex: 1,
                            height: auroraScreenH,
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: auroraScreenW,
                        }}>
                            <PulseView style={{
                                elevation: 8,
                                padding: auroraScreenW * 0.04,
                                flex: 1,
                                borderRadius: auroraScreenW * 0.06,
                                shadowColor: '#000',
                                shadowOpacity: 0.2,
                                shadowRadius: auroraScreenW * 0.03,
                                width: auroraScreenW,
                            }}>
                                <PulseView style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginBottom: auroraScreenH * 0.02,
                                }}>
                                    <PulsePress onPress={() => setStoryModalVisible(false)} style={{
                                        borderColor: '#fff',
                                        height: auroraScreenW * 0.14,
                                        borderWidth: 1,
                                        justifyContent: 'center',
                                        width: auroraScreenW * 0.14,
                                        borderRadius: auroraScreenW * 0.1,
                                        backgroundColor: 'rgba(0, 0, 0, 0.25)',
                                        alignItems: 'center',
                                    }}>
                                        <PulseImg
                                            source={require('../MidnightSalzburgNeonBeatsAssets/MidnightSalzburgNeonBeatsImages/twoMidnightArrows.png')}
                                            style={{ width: auroraScreenW * 0.07, height: auroraScreenW * 0.07 }}
                                            resizeMode='contain'
                                        />
                                    </PulsePress>
                                    <PulseTxt style={{
                                        color: '#fff',
                                        fontSize: auroraScreenW * 0.07,
                                        fontWeight: 'bold',
                                        fontFamily: pulseFonts.midnightMonratSemiBold,
                                    }}>Add Story</PulseTxt>
                                    <PulsePress
                                        style={{
                                            paddingHorizontal: auroraScreenW * 0.04,
                                            paddingVertical: auroraScreenH * 0.012,
                                            borderRadius: auroraScreenW * 0.1,
                                            backgroundColor: (!clubChoice || !storyHeading.trim() || pickedPhotos.length === 0) ? '#888' : '#C80400',
                                        }}
                                        onPress={saveStoryHandler}
                                    >
                                        <PulseTxt style={{
                                            color: '#fff',
                                            fontSize: auroraScreenW * 0.045,
                                            fontFamily: pulseFonts.midnightMonratSemiBold,
                                        }}>Save</PulseTxt>
                                    </PulsePress>
                                </PulseView>

                                <PulseView style={{ position: 'relative', marginBottom: auroraScreenH * 0.02 }}>
                                    <PulsePress
                                        style={{
                                            height: auroraScreenH * 0.055,
                                            borderWidth: 1,
                                            borderColor: '#fff',
                                            backgroundColor: 'rgba(0,0,0,0.15)',
                                            paddingHorizontal: auroraScreenW * 0.04,
                                            justifyContent: 'center',
                                            borderRadius: auroraScreenW * 0.04,
                                            width: '100%',
                                            alignItems: 'center',
                                            flexDirection: 'row',
                                        }}
                                        onPress={() => setClubsDropdown(!clubsDropdown)}
                                    >
                                        <PulseTxt style={{
                                            color: '#fff',
                                            fontSize: auroraScreenW * 0.045,
                                            fontFamily: pulseFonts.midnightMonratRegular,
                                            flex: 1,
                                        }}>
                                            {clubChoice || 'Select club'}
                                        </PulseTxt>
                                        <PulseTxt style={{ color: '#fff', fontSize: auroraScreenW * 0.05 }}>▼</PulseTxt>
                                    </PulsePress>
                                    {clubsDropdown && (
                                        <PulseView style={{
                                            position: 'absolute',
                                            maxHeight: auroraScreenH * 0.25,
                                            borderWidth: 1,
                                            width: '100%',
                                            borderRadius: auroraScreenW * 0.04,
                                            top: auroraScreenH * 0.055,
                                            borderColor: '#fff',
                                            zIndex: 10,
                                            backgroundColor: '#7a1a1a',
                                            overflow: 'hidden',
                                            left: 0,
                                        }}>
                                            <ScrollView showsVerticalScrollIndicator={false}>
                                                {clubsList.map((club, idx) => (
                                                    <PulsePress
                                                        key={club + idx}
                                                        style={{
                                                            paddingVertical: auroraScreenH * 0.012,
                                                            paddingHorizontal: auroraScreenW * 0.04,
                                                            borderBottomWidth: idx === clubsList.length - 1 ? 0 : 1,
                                                            borderBottomColor: '#fff',
                                                        }}
                                                        onPress={() => {
                                                            setClubChoice(club);
                                                            setClubsDropdown(false);
                                                        }}
                                                    >
                                                        <PulseTxt style={{
                                                            color: '#fff',
                                                            fontSize: auroraScreenW * 0.045,
                                                            fontFamily: pulseFonts.midnightMonratRegular,
                                                        }}>{club}</PulseTxt>
                                                    </PulsePress>
                                                ))}
                                            </ScrollView>
                                        </PulseView>
                                    )}
                                </PulseView>

                                <PulseInput
                                    style={{
                                        marginBottom: auroraScreenH * 0.02,
                                        color: '#fff',
                                        borderWidth: 1,
                                        borderColor: '#fff',
                                        borderRadius: auroraScreenW * 0.04,
                                        paddingHorizontal: auroraScreenW * 0.04,
                                        width: '100%',
                                        fontSize: auroraScreenW * 0.045,
                                        fontFamily: pulseFonts.midnightMonratRegular,
                                        backgroundColor: 'rgba(0,0,0,0.15)',
                                        height: auroraScreenH * 0.055,
                                    }}
                                    maxLength={25}
                                    placeholderTextColor="#fff"
                                    value={storyHeading}
                                    onChangeText={setStoryHeading}
                                    placeholder="Story Title"
                                />

                                <PulsePress
                                    style={{
                                        width: '100%',
                                        paddingHorizontal: auroraScreenW * 0.04,
                                        overflow: 'hidden',
                                        borderColor: '#fff',
                                        borderWidth: 1,
                                        height: auroraScreenH * 0.055,
                                        flexDirection: 'row',
                                        marginBottom: auroraScreenH * 0.02,
                                        backgroundColor: 'rgba(0,0,0,0.15)',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: auroraScreenW * 0.04,
                                    }}
                                    onPress={pickPhotoHandler}
                                    disabled={pickedPhotos.length >= 4}
                                >
                                    <PulseTxt style={{
                                        color: '#fff',
                                        fontSize: auroraScreenW * 0.045,
                                        fontFamily: pulseFonts.midnightMonratRegular,
                                        flex: 1,
                                    }}>Upload photo</PulseTxt>
                                    <PulseImg
                                        source={require('../MidnightSalzburgNeonBeatsAssets/MidnightSalzburgNeonBeatsImages/uloadPhotoMidnight.png')}
                                        style={{ width: auroraScreenH * 0.03, height: auroraScreenH * 0.03 }}
                                        resizeMode='contain'
                                    />
                                </PulsePress>

                                <PulseView style={{
                                    flexDirection: 'row',
                                    flexWrap: 'wrap',
                                    justifyContent: 'space-between',
                                    marginTop: auroraScreenH * 0.01,
                                }}>
                                    {pickedPhotos.map((uri, idx) => (
                                        <PulseView key={uri} style={{
                                            justifyContent: 'center',
                                            height: auroraScreenW * 0.44,
                                            marginBottom: auroraScreenH * 0.015,
                                            alignItems: 'center',
                                            borderRadius: auroraScreenW * 0.04,
                                            overflow: 'hidden',
                                            position: 'relative',
                                            marginRight: (idx % 2 === 0) ? auroraScreenW * 0.03 : 0,
                                            backgroundColor: 'rgba(0,0,0,0.15)',
                                            width: auroraScreenW * 0.44,
                                        }}>
                                            <PulseImg
                                                source={{ uri }}
                                                style={{ width: '100%', height: '100%', borderRadius: auroraScreenW * 0.04 }}
                                            />
                                            <PulsePress
                                                style={{
                                                    justifyContent: 'center',
                                                    height: auroraScreenW * 0.06,
                                                    top: auroraScreenW * 0.015,
                                                    right: auroraScreenW * 0.015,
                                                    position: 'absolute',
                                                    borderRadius: auroraScreenW * 0.03,
                                                    width: auroraScreenW * 0.06,
                                                    backgroundColor: 'rgba(255, 255, 255, 0.19)',
                                                    alignItems: 'center',
                                                }}
                                                onPress={() => removePhotoHandler(idx)}
                                            >
                                                <PulseTxt style={{ color: '#fff', fontSize: auroraScreenW * 0.045 }}>✕</PulseTxt>
                                            </PulsePress>
                                        </PulseView>
                                    ))}
                                </PulseView>
                            </PulseView>
                        </PulseView>
                    </PulseModal>
                </PulseView>
            </PulseView>
        </TouchableWithoutFeedback>
    );
};

const StoryCard: React.FC<{
    story: any;
    auroraScreenW: number;
    auroraScreenH: number;
    pulseFonts: any;
}> = ({ story, auroraScreenW, auroraScreenH, pulseFonts }) => {
    const [currImgIdx, setCurrImgIdx] = usePulseState(0);

    const cyclePhotoHandler = () => {
        const nextIndex = (currImgIdx + 1) % story.photos.length;
        setCurrImgIdx(nextIndex);
    };

    return (
        <Pressable
            style={{
                backgroundColor: 'rgba(0,0,0,0.10)',
                borderColor: '#fff',
                borderWidth: 2,
                marginBottom: auroraScreenH * 0.04,
                borderRadius: auroraScreenW * 0.04,
                padding: auroraScreenW * 0.03,
            }}
            >
            <PulseView style={{
                justifyContent: 'center',
                width: '100%',
                borderRadius: auroraScreenW * 0.03,
                overflow: 'hidden',
                alignItems: 'center',
                marginBottom: auroraScreenH * 0.015,
                backgroundColor: '#222',
                aspectRatio: 1.7,
            }}>
                <PulsePress 
                    style={{ width: '100%', height: '100%' }}
                    onPress={cyclePhotoHandler}
                    activeOpacity={0.8}
                >
                    <PulseImg
                        source={{ uri: story.photos[currImgIdx] }}
                        style={{ width: '100%', height: '100%', borderRadius: auroraScreenW * 0.03 }}
                        resizeMode="cover"
                    />
                </PulsePress>

                {story.photos.length > 1 && (
                    <PulseView style={{
                        paddingHorizontal: auroraScreenW * 0.02,
                        top: auroraScreenH * 0.015,
                        right: auroraScreenW * 0.03,
                        paddingVertical: auroraScreenH * 0.004,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        borderRadius: auroraScreenW * 0.02,
                        position: 'absolute',
                    }}>
                        <PulseTxt style={{
                            color: '#fff',
                            fontSize: auroraScreenW * 0.035,
                            fontFamily: pulseFonts.midnightMonratRegular,
                        }}>
                            {currImgIdx + 1}/{story.photos.length}
                        </PulseTxt>
                    </PulseView>
                )}

                {story.photos.length > 1 && (
                    <PulseView style={{
                        alignItems: 'center',
                        bottom: auroraScreenH * 0.015,
                        left: 0,
                        justifyContent: 'center',
                        right: 0,
                        flexDirection: 'row',
                        position: 'absolute',
                    }}>
                        {story.photos.map((_: any, dotIdx: number) => (
                            <PulsePress
                                key={dotIdx}
                                style={{
                                    marginHorizontal: auroraScreenW * 0.01,
                                    height: auroraScreenW * 0.025,
                                    backgroundColor: dotIdx === currImgIdx ? '#D40121' : '#D9D9D9',
                                    borderRadius: auroraScreenW * 0.0125,
                                    width: auroraScreenW * 0.025,
                                }}
                                onPress={() => setCurrImgIdx(dotIdx)}
                            />
                        ))}
                    </PulseView>
                )}
            </PulseView>
            <PulseView style={{
                marginTop: auroraScreenH * 0.01,
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
            }}>
                <PulseTxt style={{
                    color: '#fff',
                    fontSize: auroraScreenW * 0.055,
                    fontFamily: pulseFonts.midnightMonratSemiBold,
                    maxWidth: auroraScreenW * 0.4,
                }}>
                    {story.title}
                </PulseTxt>
                <PulseView style={{
                    alignItems: 'center',
                    borderColor: '#fff',
                    maxWidth: auroraScreenW * 0.35,
                    paddingHorizontal: auroraScreenW * 0.04,
                    paddingVertical: auroraScreenH * 0.008,
                    backgroundColor: '#a81c1c',
                    borderRadius: auroraScreenW * 0.04,
                    justifyContent: 'center',
                    borderWidth: 2,
                }}>
                    <PulseTxt style={{
                        fontFamily: pulseFonts.midnightMonratSemiBold,
                        fontSize: auroraScreenW * 0.045,
                        color: '#fff',
                    }}>
                        {story.club}
                    </PulseTxt>
                </PulseView>
            </PulseView>
        </Pressable>
    );
};

export default MidnightSalzburgNeonStories;
