import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, View } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Avatar, Incubator, Text, TextField } from 'react-native-ui-lib';
import Icon from 'react-native-vector-icons/Feather';
import useTheme from '@/Hooks/useTheme';
import FormButton from '@/Components/FormButton';

import { styles } from './styles';
import { Post, postApi } from '@/Services/modules/posts';
import { store } from '@/Store';
import { setNotification } from '@/Store/Notification';
import { PageSection } from '.';

type PostProps = {
  setPage: (page: PageSection) => void;
  setShouldRefetch: (shouldRefetch: boolean) => void;
};

const NewPost = ({ setPage, setShouldRefetch }: PostProps) => {
  const { Layout, Colors, Fonts } = useTheme();
  const [image, setImage] = useState<{
    fileName?: string;
    base64?: string;
  }>();
  const [post, setPost] = useState<string>();
  const [savePost, { isLoading, isSuccess, isError }] =
    postApi.useSavePostMutation();

  useEffect(() => {
    if (isSuccess) {
      store.dispatch(
        setNotification({
          preset: Incubator.ToastPresets.SUCCESS,
          message: 'La publicación se ha creado exitosamente.',
        })
      );
      setShouldRefetch(false);
      setPage(PageSection.POSTS);
    }
    if (isError) {
      store.dispatch(
        setNotification({
          preset: Incubator.ToastPresets.FAILURE,
          message: 'Hubo un error al crear la publicación. Intente nuevamente',
        })
      );
    }
  }, [isSuccess, isError]);

  const handleCamera = async () => {
    const { assets } = await launchCamera({
      mediaType: 'photo',
      includeBase64: true,
    });
    setImage({ fileName: assets?.[0].fileName, base64: assets?.[0].base64 });
  };

  const handleGallery = async () => {
    const { assets } = await launchImageLibrary({
      mediaType: 'photo',
      includeBase64: true,
    });

    setImage({ fileName: assets?.[0].fileName, base64: assets?.[0].base64 });
  };

  const publishPost = async () => {
    const newPost = {
      body: post,
      image: image?.base64,
    } as Post;

    await savePost(newPost);
  };

  return (
    <>
      <View style={[{ padding: 20 }, Layout.fill, Layout.alignItemsStart]}>
        <View style={[Layout.rowCenter]}>
          <Avatar
            size={40}
            containerStyle={{ marginVertical: 20 }}
            animate
            labelColor={Colors.white}
            backgroundColor={Colors.red}
            label="MD"
          />
          <Text
            style={[Fonts.textRegular, styles.userName, { color: Colors.red }]}
          >
            Mati Dastugue
          </Text>
        </View>
        <TextField
          migrate
          onChangeText={(value: string) => setPost(value)}
          style={styles.postBox}
          multiline={true}
          numberOfLines={10}
          placeholder="Escribe algo..."
        />
        {image && (
          <View>
            <Image
              source={{ uri: `data:image/jpeg;base64,${image?.base64}` }}
              style={styles.imageContainer}
            />
            <Icon
              style={{ position: 'absolute', right: 0 }}
              name="x"
              color={Colors.white}
              onPress={() => setImage(undefined)}
              size={20}
            />
          </View>
        )}
        <Text
          style={{
            ...styles.divider,
            width: '95%',
            borderBottomColor: Colors.darkGray,
          }}
        />
        <View style={[Layout.row, Layout.justifyContentBetween]}>
          <View style={[Layout.fill, Layout.row, Layout.alignItemsCenter]}>
            <Icon
              style={{ marginRight: 20 }}
              name="camera"
              size={30}
              onPress={handleCamera}
            />
            <Icon name="image" size={30} onPress={handleGallery} />
          </View>
          <View style={styles.postActions}>
            <FormButton
              disabledCondition={!post}
              label="Publicar"
              labelStyle={styles.button}
              noMarginBottom
              backgroundColor={Colors.red}
              onPress={publishPost}
            />
          </View>
        </View>
        {isLoading && (
          <ActivityIndicator
            style={styles.done}
            size="small"
            color={Colors.black}
          />
        )}
      </View>
    </>
  );
};

export default NewPost;
