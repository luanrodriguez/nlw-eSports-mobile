import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Background } from "../../components/Background";
import { View, TouchableOpacity, Image, FlatList, Text } from "react-native";
import { Entypo } from "@expo/vector-icons";
import logoImg from "../../assets/logo-nlw-esports.png";

import { styles } from "./styles";
import { GameParams } from "../../@types/navigation";
import { THEME } from "../../theme";
import { Heading } from "../../components/Heading";
import { DuoCard, DuoCardProps } from "../../components/DuoCard";
import { useEffect, useState } from "react";
import { DuoMatch } from "../../components/DuoMatch";

export function Game() {
  const route = useRoute();
  const [duos, setDuos] = useState<DuoCardProps[]>([]);
  const [discordDuoSelect, setDiscordDuoSelected] = useState<string>("");
  const game = route.params as GameParams;
  const navigation = useNavigation();

  function getUserDiscord(adsId: string) {
    fetch(`http://192.168.15.17:3333/ads/${adsId}/discord`)
      .then((response) => response.json())
      .then((data) => {
        setDiscordDuoSelected(data.discord);
      })
      .catch((err) => console.log(err));
  }

  function handleGoBack() {
    navigation.goBack();
  }

  useEffect(() => {
    fetch(`http://192.168.15.17:3333/games/${game.id}/ads`)
      .then((response) => response.json())
      .then((data) => {
        setDuos(data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <Background>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack}>
            <Entypo
              name="chevron-thin-left"
              color={THEME.COLORS.CAPTION_300}
              size={20}
            />
          </TouchableOpacity>

          <Image source={logoImg} style={styles.logo} />

          <View style={styles.right} />
        </View>
        <Image
          source={{ uri: game.banner }}
          style={styles.cover}
          resizeMode="cover"
        />
        <Heading title={game.title} subtitle="Conecte-se e comece a jogar!" />
        <FlatList
          data={duos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <DuoCard
              data={item}
              onConnect={() => {
                getUserDiscord(item.id);
              }}
            />
          )}
          horizontal
          style={styles.containerList}
          contentContainerStyle={[
            duos.length > 0 ? styles.contentList : styles.emptyListContent,
          ]}
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={() => (
            <Text style={styles.emptyListText}>
              Ainda não há anúncios publicados para esse jogo
            </Text>
          )}
        />

        <DuoMatch
          visible={discordDuoSelect.length > 0}
          discord={discordDuoSelect}
          onClose={() => {
            setDiscordDuoSelected("");
          }}
        />
      </SafeAreaView>
    </Background>
  );
}
