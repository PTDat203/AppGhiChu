import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { noteService } from '../services/noteService';

const EditNoteScreen = ({ route, navigation }) => {
  const { noteId, title: initialTitle, content: initialContent } = route.params;
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [isLoading, setIsLoading] = useState(false);  const handleUpdateNote = async () => {
    if (!title || !content) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ tiêu đề và nội dung');
      return;
    }

    try {
      setIsLoading(true);
      const result = await noteService.updateNote(noteId, {
        title,
        content,
        category: 'personal',
        priority: 'medium'
      });

      if (result.success) {
        Alert.alert('Thành công', 'Cập nhật ghi chú thành công', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        Alert.alert('Lỗi', result.message);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể cập nhật ghi chú');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteNote = () => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa ghi chú này không?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoading(true);
              const result = await noteService.deleteNote(noteId);
              if (result.success) {
                Alert.alert('Thành công', 'Xóa ghi chú thành công', [
                  {
                    text: 'OK',
                    onPress: () => navigation.goBack(),
                  },
                ]);
              } else {
                Alert.alert('Lỗi', result.message);
              }
            } catch (error) {
              Alert.alert('Lỗi', 'Không thể xóa ghi chú');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.label}>Tiêu đề</Text>
        <TextInput
          style={styles.titleInput}
          value={title}
          onChangeText={setTitle}
          placeholder="Nhập tiêu đề ghi chú"
          placeholderTextColor="#999"
          maxLength={100}
        />

        <Text style={styles.label}>Nội dung</Text>
        <TextInput
          style={styles.contentInput}
          value={content}
          onChangeText={setContent}
          placeholder="Nhập nội dung ghi chú"
          placeholderTextColor="#999"
          multiline
          textAlignVertical="top"
        /><View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.updateButton, isLoading && styles.disabledButton]}
            onPress={handleUpdateNote}
            disabled={isLoading}
          >
            <Text style={styles.updateButtonText}>
              {isLoading ? 'Đang cập nhật...' : 'Cập nhật'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.deleteButton, isLoading && styles.disabledButton]}
            onPress={handleDeleteNote}
            disabled={isLoading}
          >
            <Text style={styles.deleteButtonText}>Xóa</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  titleInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  contentInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    height: 200,
  },  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  updateButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 10,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.7,
  },
});

export default EditNoteScreen;
