import AddNewClub from './AddNewClub';
import { fonts as beatFonts } from '../fonts';
import ClubDetailsModal from './ClubDetailsModal';
import midnightClubs from '../MidnightSalzburgNeonBeatsData/midnightClubs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState as useBeatState, useEffect as useBeatEffect } from 'react';
const { width: neonScreenW, height: neonScreenH } = BeatDims.get('window');
import {
    SafeAreaView as BeatSafe,
    ScrollView as BeatScroll,
    Text as BeatTxt,
    View as BeatView,
    TextInput as BeatInput,
    TouchableOpacity as BeatPress,
    Image as BeatImg,
    StyleSheet,
    Dimensions as BeatDims,
    Platform,
} from 'react-native';

const MidnightSalzburgNeonBeats: React.FC = () => {
    const [filterQuery, setFilterQuery] = useBeatState('');
    const [selectedTab, setSelectedTab] = useBeatState<'all' | 'my'>('all');
    const [showCreateClub, setShowCreateClub] = useBeatState(false);
    const [userClubList, setUserClubList] = useBeatState<any[]>([]);
    const [selectedClub, setSelectedClub] = useBeatState<any | null>(null);

    useBeatEffect(() => {
        if (selectedTab === 'my') {
            AsyncStorage.getItem('myMidnightSalzburgClubs').then(clubCache => {
                setUserClubList(clubCache ? JSON.parse(clubCache) : []);
            });
        }
    }, [selectedTab, showCreateClub]);

    const listToRender = selectedTab === 'all' ? midnightClubs : userClubList;

    const matchedClubs = listToRender.filter(item =>
        item.mindightClub.toLowerCase().includes(filterQuery.toLowerCase())
    );

    const nothingFound = matchedClubs.length === 0;

    return (
        <BeatView style={{ flex: 1 }}>
            <BeatSafe />
            <BeatView style={{ paddingTop: neonScreenH * 0.01, paddingHorizontal: neonScreenW * 0.05 }}>
                <BeatTxt style={{
                    fontFamily: beatFonts.midnightMonratSemiBold,
                    fontWeight: 'bold',
                    color: '#fff',
                    textAlign: 'center',
                    fontSize: neonScreenW * 0.07,
                    marginBottom: neonScreenH * 0.025,
                }}>
                    {Platform.OS === 'android' ? '888' : 'Neon'} Beats of Salzburg
                </BeatTxt>
                <BeatView style={styles.searchWrapper}>
                    <BeatInput
                        onChangeText={setFilterQuery}
                        style={styles.searchField}
                        value={filterQuery}
                        placeholderTextColor="#bfa3a3"
                        placeholder="Search by name ..."
                    />
                    {filterQuery.length > 0 && (
                        <BeatPress onPress={() => setFilterQuery('')} style={styles.clearBtn}>
                            <BeatTxt style={{ fontSize: neonScreenW * 0.044, color: '#fff', opacity: 0.7 }}>✕</BeatTxt>
                        </BeatPress>
                    )}
                    <BeatView style={styles.iconBox}>
                        <BeatImg
                            source={require('../MidnightSalzburgNeonBeatsAssets/MidnightSalzburgNeonBeatsImages/midnightDandruff.png')}
                            resizeMode='contain'
                            style={{ width: neonScreenW * 0.061, height: neonScreenW * 0.061, marginLeft: neonScreenW * 0.01 }}
                        />
                    </BeatView>
                </BeatView>
                <BeatView style={styles.tabWrapper}>
                    <BeatPress
                        style={[styles.tabBtn, selectedTab === 'all' && styles.tabBtnActive]}
                        onPress={() => setSelectedTab('all')}
                    >
                        <BeatTxt style={[styles.tabTxt, selectedTab === 'all' && styles.tabTxtActive]}>All</BeatTxt>
                    </BeatPress>
                    <BeatPress
                        style={[styles.tabBtn, selectedTab === 'my' && styles.tabBtnActive]}
                        onPress={() => setSelectedTab('my')}
                    >
                        <BeatTxt style={[styles.tabTxt, selectedTab === 'my' && styles.tabTxtActive]}>My Clubs</BeatTxt>
                    </BeatPress>
                </BeatView>
            </BeatView>
            <BeatScroll
                showsVerticalScrollIndicator={false}
                style={{ flex: 1, marginTop: neonScreenH * 0.012 }}
                contentContainerStyle={{ paddingBottom: neonScreenH * 0.15, flexGrow: 1 }}
            >
                {!nothingFound && matchedClubs.map((clubData, k) => (
                    <BeatPress key={clubData.id || k} style={styles.card} onPress={() => setSelectedClub(clubData)}>
                        <BeatImg
                            source={
                                typeof clubData.midnightImageOfClub === 'string'
                                    ? { uri: clubData.midnightImageOfClub }
                                    : clubData.midnightImageOfClub
                            }
                            style={styles.cardImg}
                        />
                        <BeatView style={{ padding: neonScreenW * 0.04 }}>
                            <BeatView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <BeatTxt style={styles.cardTitle}>{clubData.mindightClub}</BeatTxt>
                                {selectedTab === 'all' && (
                                    <BeatView style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <BeatTxt style={styles.cardRating}>{parseFloat(clubData.midnightRating).toFixed(1)}</BeatTxt>
                                        <BeatImg source={require('../MidnightSalzburgNeonBeatsAssets/MidnightSalzburgNeonBeatsImages/midnightStarNeon.png')} resizeMode='contain' style={{ width: neonScreenW * 0.061, height: neonScreenW * 0.061, marginLeft: neonScreenW * 0.01 }} />
                                    </BeatView>
                                )}
                            </BeatView>
                            <BeatView style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: neonScreenH * 0.012 }}>
                                {clubData.mindightMusicStyle.map((genre, idx) => (
                                    <BeatView key={idx} style={styles.tag}>
                                        <BeatTxt style={styles.tagTxt}>{genre}</BeatTxt>
                                    </BeatView>
                                ))}
                            </BeatView>
                        </BeatView>
                    </BeatPress>
                ))}
                {nothingFound && (
                    <BeatView style={styles.noClubsBox}>
                        <BeatTxt style={styles.noClubsHeader}>No Clubs Found</BeatTxt>
                        <BeatTxt style={styles.noClubsSubheader}>
                            You can try a different keyword —{'\n'}or add your own place to the map
                        </BeatTxt>
                        <BeatPress style={styles.addClubBtn} onPress={() => setShowCreateClub(true)}>
                            <BeatTxt style={styles.addClubTxt}>+</BeatTxt>
                        </BeatPress>
                    </BeatView>
                )}
            </BeatScroll>
            <AddNewClub
                visible={showCreateClub}
                onClose={() => setShowCreateClub(false)}
            />
            <ClubDetailsModal
                visible={!!selectedClub}
                club={selectedClub}
                onClose={() => setSelectedClub(null)}
            />
        </BeatView>
    );
};

const styles = StyleSheet.create({
    searchWrapper: {
        borderRadius: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        flexDirection: 'row',
        borderColor: '#fff',
        alignItems: 'center',
        paddingHorizontal: neonScreenW * 0.04,
        borderWidth: 2,
        marginBottom: neonScreenH * 0.02,
    },
    searchField: {
        fontSize: neonScreenW * 0.045,
        height: neonScreenH * 0.055,
        fontFamily: beatFonts.midnightMonratRegular,
        color: '#fff',
        flex: 1,
    },
    iconBox: {
        marginLeft: neonScreenW * 0.02,
    },
    clearBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: neonScreenW * 0.04,
        backgroundColor: 'rgba(255,255,255,0.15)',
        marginRight: neonScreenW * 0.02,
        padding: neonScreenW * 0.01,
        width: neonScreenH * 0.035,
        height: neonScreenH * 0.035,
    },
    tabWrapper: {
        marginBottom: neonScreenH * 0.012,
        flexDirection: 'row',
    },
    tabBtn: {
        backgroundColor: 'rgba(255,255,255,0.08)',
        marginRight: neonScreenW * 0.02,
        flex: 1,
        paddingVertical: neonScreenH * 0.014,
        borderRadius: 10,
    },
    tabBtnActive: {
        backgroundColor: '#C80400',
    },
    tabTxt: {
        textAlign: 'center',
        color: '#fff',
        fontSize: neonScreenW * 0.045,
        fontFamily: beatFonts.midnightMonratMedium,
    },
    tabTxtActive: {
        fontWeight: 'bold',
        color: '#fff',
    },
    card: {
        marginHorizontal: neonScreenW * 0.05,
        borderColor: '#fff',
        borderWidth: 2,
        overflow: 'hidden',
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.25)',
        marginBottom: neonScreenH * 0.03,
    },
    cardImg: {
        borderRadius: neonScreenW * 0.04,
        marginTop: neonScreenH * 0.019,
        height: neonScreenH * 0.23,
        width: '90%',
        alignSelf: 'center',
    },
    cardTitle: {
        fontSize: neonScreenW * 0.055,
        fontWeight: 'bold',
        color: '#fff',
        fontFamily: beatFonts.midnightMonratSemiBold,
    },
    cardRating: {
        fontSize: neonScreenW * 0.045,
        color: '#fff',
        fontFamily: beatFonts.midnightMonratMedium,
    },
    tag: {
        marginBottom: neonScreenH * 0.01,
        borderColor: '#fff',
        borderWidth: 1,
        paddingHorizontal: neonScreenW * 0.03,
        backgroundColor: 'rgba(255,255,255,0.08)',
        paddingVertical: neonScreenH * 0.008,
        borderRadius: 16,
        marginRight: neonScreenW * 0.02,
    },
    tagTxt: {
        color: '#fff',
        fontSize: neonScreenW * 0.04,
        fontFamily: beatFonts.midnightMonratMedium,
    },
    noClubsBox: {
        flex: 1,
        alignItems: 'center',
        marginTop: neonScreenH * 0.12,
        justifyContent: 'center',
    },
    noClubsHeader: {
        fontFamily: beatFonts.midnightMonratSemiBold,
        fontWeight: 'bold',
        fontSize: neonScreenW * 0.07,
        color: '#fff',
        marginBottom: neonScreenH * 0.02,
    },
    noClubsSubheader: {
        fontFamily: beatFonts.midnightMonratRegular,
        fontSize: neonScreenW * 0.045,
        color: '#fff',
        textAlign: 'center',
        marginBottom: neonScreenH * 0.04,
    },
    addClubBtn: {
        justifyContent: 'center',
        borderWidth: 2,
        alignItems: 'center',
        width: neonScreenW * 0.16,
        height: neonScreenW * 0.16,
        backgroundColor: '#C80400',
        borderRadius: neonScreenW * 0.08,
        borderColor: '#fff',
    },
    addClubTxt: {
        fontSize: neonScreenW * 0.09,
        fontWeight: 'bold',
        color: '#fff',
        fontFamily: beatFonts.midnightMonratSemiBold,
    },
});

export default MidnightSalzburgNeonBeats;