import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { CONVERSATIONS } from "@/data/conversations";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { Search } from "../../components/Search";

//TODO: Implement BE socket logic for chat

const SearchScreen = () => {
  const insets = useSafeAreaInsets();

  const [conversationList, setConversationList] = useState(CONVERSATIONS);
  const [selectedConversation, setSelectedConversation] = useState<
    (typeof conversationList)[0] | undefined
  >(undefined);

  const [message, setMessage] = useState("");

  const sendMessage = () => {
    const conversationId = selectedConversation?.id;

    const trimmedMessage = message.trim();

    if (conversationId && trimmedMessage) {
      setConversationList((prev) => {
        const updatedIndex = prev.findIndex(({ id }) => id === conversationId);

        if (updatedIndex >= 0) {
          const updated = [...prev];
          updated[updatedIndex].messages = [
            ...updated[updatedIndex].messages,
            {
              id: Math.floor(Math.random() * 1000000),
              text: trimmedMessage,
              fromUser: true,
              timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
              time: "2min",
            },
          ];

          return updated;
        }

        return prev;
      });
    }

    setMessage("");
  };

  const selectConversation = (
    conversationData: (typeof conversationList)[0],
  ) => {
    setSelectedConversation(conversationData);
  };

  const onBack = () => {
    setSelectedConversation(undefined);
  };

  const onLongPress = (id: number) => {
    Alert.alert(
      "Delete Conversation",
      "Are you sure you want to delete this conversation?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setConversationList((prev) =>
              prev.filter(({ id: itemId }) => id !== itemId),
            );
          },
        },
      ],
    );
  };

  const isModalOpen = !!selectedConversation;

  return (
    <SafeAreaView className=" flex-1 px-4" edges={["top", "left", "right"]}>
      <View className="flex-row items-center justify-between ">
        <Text className="text-lg font-bold">Messages</Text>
        <Feather name="edit" size={20} color="#1DA1F2" />
      </View>

      <View className="flex-1 gap-2">
        <View className="pt-3">
          <Search placeholder="Search for the people and groups" />
        </View>

        <ScrollView className="flex-col">
          {conversationList.map((conversationData, index) => {
            const { id, user, timestamp, lastMessage, time } =
              conversationData || {};

            return (
              <TouchableOpacity
                key={id}
                className={`flex-row gap-4 py-2  ${index !== conversationList.length - 1 && "mb-3"} `}
                onPress={() => selectConversation(conversationData)}
                onLongPress={() => onLongPress(id)}
              >
                <Image
                  source={{ uri: user.avatar }}
                  className="size-12 rounded-full"
                />

                <View className="flex-1 gap-1">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row gap-3">
                      <Text className="text-md font-bold">{user.name}</Text>
                      <Text className="text-sm text-gray-500">
                        @{user.username}{" "}
                      </Text>
                    </View>
                    <Text className="text-sm text-gray-500">{time}</Text>
                  </View>

                  <Text numberOfLines={1} className="text-sm text-gray-500">
                    {lastMessage}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <Text className="mb-2 text-center text-sm text-gray-500">
        Tap to open • Long press to delete
      </Text>

      <Modal
        presentationStyle="pageSheet"
        visible={isModalOpen}
        animationType="slide"
      >
        {isModalOpen && (
          <View style={{ flex: 1, paddingBottom: insets.bottom }}>
            <View className="flex-row items-center gap-4 px-4 py-2">
              <Feather
                name="arrow-left"
                size={24}
                color="#1DA1F2"
                onPress={onBack}
              />
              <View className="flex-row items-center  gap-3">
                <Image
                  source={{ uri: selectedConversation.user.avatar }}
                  className="size-12 rounded-full"
                />
                <View className="">
                  <Text className="text-md font-bold">
                    {selectedConversation.user.name}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    @{selectedConversation.user.username}{" "}
                  </Text>
                </View>
              </View>
            </View>

            <ScrollView
              className="px-2 py-3"
              showsVerticalScrollIndicator={false}
            >
              <Text className="mb-3 text-center text-sm text-gray-500">
                This is a start of your conversation with{" "}
                {selectedConversation.user.name}
              </Text>

              {selectedConversation.messages.map(
                ({ id, text, fromUser, time }, index) => {
                  return (
                    <View
                      key={id}
                      className={`${index !== selectedConversation.messages.length && "mb-3"}`}
                    >
                      <View
                        className={`flex-row items-center gap-2 ${fromUser && "justify-end"}`}
                      >
                        {!fromUser && (
                          <Image
                            source={{ uri: selectedConversation.user.avatar }}
                            className="size-8 rounded-full"
                          />
                        )}
                        <Text
                          key={id}
                          className={`max-w-xs  ${fromUser ? "justify-end bg-blue-500 text-white" : "bg-gray-200 text-gray-900"} rounded-lg px-2 py-2`}
                        >
                          {text}
                        </Text>
                      </View>
                      <Text
                        className={`mt-1 flex text-xs text-gray-500 ${fromUser ? "text-right" : "ml-12"}`}
                      >
                        {time}
                      </Text>
                    </View>
                  );
                },
              )}
            </ScrollView>

            <View className="mt-4 flex-row items-center gap-3 px-3">
              <TextInput
                placeholder="Start a message..."
                className="flex-1 rounded-3xl bg-gray-100 px-3 py-2"
                value={message}
                onChangeText={setMessage}
                multiline
              />

              <TouchableOpacity
                disabled={!message?.trim()}
                onPress={sendMessage}
                className="flex size-10 items-center justify-center rounded-full bg-gray-200"
              >
                <Feather
                  name="send"
                  size={20}
                  color={message?.trim() ? "white" : "#f3f4f6"}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Modal>
    </SafeAreaView>
  );
};

export default SearchScreen;
