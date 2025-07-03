import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/Header';
import ChatBubble from '@/components/ChatBubble';
import { colors, fonts, sizes, spacing, borderRadius } from '@/constants/theme';
import { Send, Mic } from 'lucide-react-native';
import { chatSuggestions } from '@/data/mockData';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI travel assistant for Ladakh. I can help you with places to visit, weather information, local customs, and travel tips. What would you like to know?',
      isUser: false,
      timestamp: '10:30 AM',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const sendMessage = (text: string = inputText) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(text.trim()),
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const getAIResponse = (userText: string): string => {
    const text = userText.toLowerCase();
    
    if (text.includes('pack') || text.includes('packing')) {
      return 'For Ladakh, pack warm clothes even in summer! Essentials include: thermal wear, windproof jacket, sunglasses, sunscreen (high SPF), comfortable trekking shoes, and a first-aid kit. Don\'t forget your camera for those stunning landscapes!';
    } else if (text.includes('pangong') || text.includes('lake')) {
      return 'Pangong Lake is breathtaking! Best visited early morning or late afternoon for photography. The lake changes colors throughout the day. Stay overnight at nearby camps for the full experience. Remember, it\'s at 4,350m altitude, so take it easy.';
    } else if (text.includes('food') || text.includes('eat')) {
      return 'Try these local delicacies: Momos (steamed dumplings), Thukpa (noodle soup), Skyu (traditional pasta), Chang (barley beer), and butter tea. For vegetarians, Dal-rice and local bread are always available. German Bakery in Leh is popular among travelers!';
    } else if (text.includes('altitude') || text.includes('sickness')) {
      return 'Altitude sickness prevention: Arrive in Leh and rest for 24-48 hours. Drink 3-4 liters of water daily, avoid alcohol initially, eat light meals, and don\'t overexert. If you feel dizzy, nauseous, or have headaches, descend immediately and consult a doctor.';
    } else if (text.includes('nubra') || text.includes('valley')) {
      return 'Nubra Valley is magical! Famous for Bactrian camels at Hunder sand dunes, Diskit Monastery with giant Buddha statue, and beautiful landscapes. Stay overnight for the best experience. The road via Khardung La pass is an adventure itself!';
    } else {
      return 'That\'s a great question about Ladakh! While I have extensive knowledge about the region, I\'d recommend checking with local guides for the most current information. Is there anything specific about places to visit, weather, or local culture you\'d like to know?';
    }
  };

  const handleSuggestion = (suggestion: string) => {
    sendMessage(suggestion);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="AI Travel Assistant" 
        subtitle="Ask me anything about Ladakh"
      />
      
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((message) => (
          <ChatBubble
            key={message.id}
            message={message.text}
            isUser={message.isUser}
            timestamp={message.timestamp}
          />
        ))}
      </ScrollView>

      {messages.length === 1 && (
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>Quick suggestions:</Text>
          <FlatList
            data={chatSuggestions}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionChip}
                onPress={() => handleSuggestion(item)}
              >
                <Text style={styles.suggestionText}>{item}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Ask about Ladakh..."
          placeholderTextColor={colors.muted}
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
        />
        <TouchableOpacity style={styles.micButton}>
          <Mic size={20} color={colors.textLight} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.sendButton, inputText.trim() && styles.sendButtonActive]}
          onPress={() => sendMessage()}
        >
          <Send size={20} color={inputText.trim() ? colors.card : colors.muted} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  messagesContainer: {
    flex: 1,
    paddingVertical: spacing.sm,
  },
  suggestionsContainer: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  suggestionsTitle: {
    fontSize: sizes.sm,
    fontFamily: fonts.medium,
    color: colors.textLight,
    marginBottom: spacing.sm,
  },
  suggestionChip: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    marginRight: spacing.sm,
  },
  suggestionText: {
    fontSize: sizes.sm,
    fontFamily: fonts.regular,
    color: colors.primary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: sizes.md,
    fontFamily: fonts.regular,
    color: colors.text,
    maxHeight: 100,
    minHeight: 40,
  },
  micButton: {
    padding: spacing.sm,
    marginLeft: spacing.sm,
  },
  sendButton: {
    padding: spacing.sm,
    marginLeft: spacing.xs,
  },
  sendButtonActive: {
    backgroundColor: colors.primary,
    borderRadius: 20,
  },
});