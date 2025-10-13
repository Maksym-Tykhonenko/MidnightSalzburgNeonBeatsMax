import React from 'react';
import { Modal, View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, ScrollView, SafeAreaView, Share, Platform } from 'react-native';
import { fonts as beatFonts } from '../fonts';

const { width: neonScreenW, height: neonScreenH } = Dimensions.get('window');

type Props = {
    visible: boolean;
    club: any | null;
    onClose: () => void;
};

const ClubDetailsModal: React.FC<Props> = ({ visible, club, onClose }) => {
    if (!club) return null;
    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                {Platform.OS === 'android' && (
                    <View style={{ paddingTop: neonScreenH * 0.0350345 }} />
                )}
                <View style={styles.modalBox}>
                    <Image
                        source={require('../MidnightSalzburgNeonBeatsAssets/MidnightSalzburgNeonBeatsImages/midnightAppGround.png')}
                        style={{
                            zIndex: 0,
                            top: 0,
                            height: neonScreenH,
                            left: 0,
                            width: neonScreenW,
                            position: 'absolute',
                        }}
                    />
                    <SafeAreaView />
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onClose} style={styles.backBtn}>
                            <Image
                                source={require('../MidnightSalzburgNeonBeatsAssets/MidnightSalzburgNeonBeatsImages/twoMidnightArrows.png')}
                                style={{
                                    width: neonScreenW * 0.07,
                                    height: neonScreenW * 0.07,
                                }}
                                resizeMode='contain'
                            />
                        </TouchableOpacity>
                        <Text style={{
                            fontFamily: beatFonts.midnightMonratSemiBold,
                            fontSize: neonScreenW * 0.07,
                            maxWidth: neonScreenW * 0.57,
                            fontWeight: 'bold',
                            color: '#fff',
                        }} adjustsFontSizeToFit numberOfLines={1}>{club.mindightClub}</Text>
                        <TouchableOpacity onPress={() => {
                            Share.share({
                                message: 'I found this cool club: ' + club.mindightClub + '. Let\'s go together!'
                            })
                        }} style={[styles.backBtn, { backgroundColor: '#C80400' }]}>
                            <Image
                                source={require('../MidnightSalzburgNeonBeatsAssets/MidnightSalzburgNeonBeatsImages/midnightShare.png')}
                                style={{
                                    width: neonScreenW * 0.07,
                                    height: neonScreenW * 0.07,
                                }}
                                resizeMode='contain'
                            />
                        </TouchableOpacity>
                    </View>
                    <ScrollView contentContainerStyle={{ paddingBottom: neonScreenH * 0.04 }}>
                        <Image
                            source={
                                typeof club.midnightImageOfClub === 'string'
                                    ? { uri: club.midnightImageOfClub }
                                    : club.midnightImageOfClub
                            }
                            style={styles.clubImg}
                            resizeMode="cover"
                        />
                        <View style={styles.genreAndRatingRow}>
                            <View style={styles.genreRowInline}>
                                {club.mindightMusicStyle.map((genre: string, idx: number) => (
                                    <View key={idx} style={styles.tag}>
                                        <Text style={styles.tagTxt}>{genre}</Text>
                                    </View>
                                ))}
                            </View>
                            <View style={styles.ratingRowInline}>
                                <Text style={styles.ratingTxt}>{parseFloat(club.midnightRating).toFixed(1)}</Text>
                                <Image
                                    source={require('../MidnightSalzburgNeonBeatsAssets/MidnightSalzburgNeonBeatsImages/midnightStarNeon.png')}
                                    style={styles.starImg}
                                    resizeMode="contain"
                                />
                            </View>
                        </View>
                        <Text style={styles.descTxt}>{club.midnightDescription}</Text>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.85)',
    },
    modalBox: {
        width: neonScreenW,
        height: neonScreenH,
        borderRadius: 24,
        overflow: 'hidden',
    },
    header: {
        paddingTop: neonScreenH * 0.025,
        paddingBottom: neonScreenH * 0.018,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: neonScreenW * 0.04,
        flexDirection: 'row',
    },
    headerTxt: {
        fontFamily: beatFonts.midnightMonratSemiBold,
        textAlign: 'center',
        color: '#fff',
        fontSize: neonScreenW * 0.07,
        fontWeight: 'bold',
        flex: 1,
    },
    backBtn: {
        alignItems: 'center',
        height: neonScreenH * 0.07,
        borderColor: '#fff',
        borderRadius: neonScreenW * 0.1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        borderWidth: 1,
        width: neonScreenH * 0.07,
    },
    backBtnTxt: {
        color: '#fff',
        fontSize: neonScreenW * 0.07,
    },
    clubImg: {
        alignSelf: 'center',
        width: '90%',
        marginBottom: neonScreenH * 0.02,
        borderRadius: neonScreenW * 0.04,
        marginTop: neonScreenH * 0.01,
        height: neonScreenH * 0.23,
    },
    genreAndRatingRow: {
        marginHorizontal: neonScreenW * 0.04,
        alignItems: 'center',
        marginBottom: neonScreenH * 0.01,
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    genreRowInline: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        flex: 1,
    },
    ratingRowInline: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: neonScreenW * 0.02,
    },
    tag: {
        paddingHorizontal: neonScreenW * 0.03,
        marginBottom: neonScreenH * 0.01,
        borderColor: '#fff',
        borderWidth: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.025)',
        paddingVertical: neonScreenH * 0.008,
        marginRight: neonScreenW * 0.02,
        borderRadius: 16,
    },
    tagTxt: {
        fontFamily: beatFonts.midnightMonratMedium,
        fontSize: neonScreenW * 0.04,
        color: '#fff',
    },
    ratingTxt: {
        fontSize: neonScreenW * 0.045,
        color: '#fff',
        fontFamily: beatFonts.midnightMonratMedium,
        marginRight: neonScreenW * 0.01,
    },
    starImg: {
        width: neonScreenW * 0.061,
        height: neonScreenW * 0.061,
    },
    descTxt: {
        textAlign: 'left',
        fontSize: neonScreenW * 0.045,
        fontFamily: beatFonts.midnightMonratRegular,
        marginHorizontal: neonScreenW * 0.04,
        marginTop: neonScreenH * 0.01,
        marginBottom: neonScreenH * 0.02,
        color: '#fff',
    },
});

export default ClubDetailsModal;
