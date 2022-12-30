import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, View } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Avatar, Incubator, Text, TextField } from 'react-native-ui-lib';
import { Image as ImageLib } from 'react-native-compressor';
import Icon from 'react-native-vector-icons/Feather';
import useTheme from '@/Hooks/useTheme';
import FormButton from '@/Components/FormButton';
import Divider from '@/Components/Divider';
import { DIABUNITY_USER, BRAND_NAME } from '@/Constants';
import { getNameInitials } from '@/Utils';
import { Post, postApi } from '@/Services/modules/posts';
import AuthService from '@/Services/modules/auth';
import { store } from '@/Store';
import { setNotification } from '@/Store/Notification';
import { PageSection } from '.';
import { styles } from './styles';

type PostProps = {
  setPage: (page: PageSection) => void;
  setShouldRefetch: (shouldRefetch: boolean) => void;
};

const NewPost = ({ setPage, setShouldRefetch }: PostProps) => {
  const user = AuthService.getCurrentUser();
  const { Layout, Colors, Fonts, Images } = useTheme();
  const [image, setImage] = useState<{
    fileName?: string;
    base64?: string;
  }>();
  const [postContent, setPostContent] = useState<string>();
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
    } else if (isError) {
      store.dispatch(
        setNotification({
          preset: Incubator.ToastPresets.FAILURE,
          message: 'Hubo un error al crear la publicación. Intente nuevamente',
        })
      );
    }
  }, [isSuccess, isError]);

  const handleImage = async (type: string = 'gallery') => {
    const imageFn = type === 'gallery' ? launchImageLibrary : launchCamera;
    let base64;
    const { assets } = await imageFn({
      mediaType: 'photo',
      quality: 0.3,
    });
    if (assets?.[0].uri) {
      base64 = await ImageLib.compress(assets?.[0].uri, {
        compressionMethod: 'auto',
        returnableOutputType: 'base64',
      });
    }

    setImage({ fileName: assets?.[0].fileName, base64 });
  };

  const publishPost = async () => {
    const newPost = {
      body: postContent,
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
            source={{ uri: user?.photoURL }}
            label={getNameInitials(user?.displayName || DIABUNITY_USER)}
          />
          <Text
            style={[Fonts.textRegular, styles.userName, { color: Colors.red }]}
          >
            {user?.displayName || DIABUNITY_USER}
            {user?.displayName === BRAND_NAME && (
              <View>
                <Image style={styles.checkmark} source={Images.checkmark} />
              </View>
            )}
          </Text>
        </View>
        <TextField
          migrate
          onChangeText={(value: string) => setPostContent(value)}
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
        <Divider customStyles={{ borderBottomColor: Colors.darkGray }} />
        <View style={[Layout.row, Layout.justifyContentBetween]}>
          <View style={[Layout.fill, Layout.row, Layout.alignItemsCenter]}>
            <Icon
              style={{ marginRight: 20 }}
              name="camera"
              size={30}
              onPress={() => handleImage('camera')}
            />
            <Icon
              name="image"
              size={30}
              onPress={() => handleImage('gallery')}
            />
          </View>
          <View style={styles.postActions}>
            <FormButton
              style={{ padding: 100 }}
              disabledCondition={!postContent}
              label="Publicar"
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
