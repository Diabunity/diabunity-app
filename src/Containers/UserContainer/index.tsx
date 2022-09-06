import React, { useEffect, useState } from 'react';
import {
  NativeSyntheticEvent,
  TextInputChangeEventData,
  ActivityIndicator,
  View,
  ScrollView,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import {
  Avatar,
  DateTimePicker,
  ListItem,
  MaskedInput,
  Text,
  Picker,
  PickerModes,
  TextField,
  Incubator,
} from 'react-native-ui-lib';
import Icon from 'react-native-vector-icons/Feather';
import { Slider } from '@miblanchard/react-native-slider';
import { User, userApi } from '@/Services/modules/users';
import { useTheme } from '@/Hooks';
import { setNotification } from '@/Store/Notification';
import AuthService from '@/Services/modules/auth';
import { getNameInitials } from '@/Utils';
import { styles } from './styles';
import ExternalLink from '@/Components/ExternalLink';
import BackButton from '@/Components/BackButton';
import FormButton from '@/Components/FormButton';
import SliderContainer from '@/Components/Slider';
import { store } from '@/Store';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

enum PageSection {
  SETTINGS = 'SETTINGS',
  PERSONAL_DATA = 'PERSONAL_DATA',
}

const UserContainer = () => {
  const user = AuthService.getCurrentUser();
  const isFocused = useIsFocused();
  const [page, setPage] = useState<PageSection | undefined>();
  const { Layout, Fonts, Colors } = useTheme();
  const { data = null, refetch } = userApi.useFetchUserQuery(user?.uid, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (!isFocused) {
      setPage(undefined);
    }
  }, [isFocused]);

  const handleLogOut = async () => {
    await AuthService.signOut();
  };

  return (
    <>
      {page ? (
        <ProfileSection
          user={user}
          page={page}
          data={data}
          handleBack={setPage}
          refetchFn={refetch}
        />
      ) : (
        <View style={[Layout.fill, Layout.alignItemsStart]}>
          <View style={[Layout.rowCenter]}>
            <Avatar
              size={60}
              containerStyle={{ marginVertical: 20, marginHorizontal: 20 }}
              animate
              isOnline
              imageProps={{ animationDuration: 1000 }}
              labelColor={Colors.white}
              backgroundColor={Colors.red}
              source={{ uri: user?.photoURL }}
              label={getNameInitials(user?.displayName)}
            />
            {user && <Text style={Fonts.textRegular}>{user.displayName}</Text>}
          </View>
          <View style={styles.divider} />
          <View
            style={[Layout.colCenter, Layout.alignItemsStart, { margin: 20 }]}
          >
            <ListItem
              style={[Layout.rowCenter]}
              onPress={() => setPage(PageSection.PERSONAL_DATA)}
            >
              <Icon name="user" size={24} color={styles.icon.color} />
              <Text style={{ ...styles.text, marginLeft: 12 }}>
                Datos Personales
              </Text>
            </ListItem>
            <ListItem
              onPress={() => setPage(PageSection.SETTINGS)}
              style={[Layout.rowCenter]}
            >
              <Icon name="settings" size={24} color={styles.icon.color} />
              <Text style={{ ...styles.text, marginLeft: 12 }}>
                Configuración
              </Text>
            </ListItem>
            <ListItem style={[Layout.rowCenter]}>
              <Icon name="info" size={24} color={styles.icon.color} />
              <ExternalLink
                style={{ ...styles.text, marginLeft: 12 }}
                url="https://diabunity.com"
              >
                <Text>Sobre Diabunity</Text>
              </ExternalLink>
            </ListItem>
            <ListItem style={[Layout.rowCenter]} onPress={handleLogOut}>
              <Icon name="log-out" size={24} color={styles.icon.color} />
              <Text style={{ ...styles.text, marginLeft: 12 }}>
                Cerrar Sesión
              </Text>
            </ListItem>
          </View>
        </View>
      )}
    </>
  );
};

const ProfileSection = ({
  page,
  data,
  user,
  handleBack,
  refetchFn,
}: {
  data: User | null;
  user: FirebaseAuthTypes.User | null;
  refetchFn: () => void;
  handleBack: (page: PageSection | undefined) => void;
  page: PageSection;
}) => {
  const [name, setName] = useState<string | undefined | null>(
    user?.displayName
  );
  const {
    birth_date = new Date(),
    weight: uWeight = '',
    height: uHeight = '',
    glucose_min = 0,
    glucose_max = 200,
    diabetes_type = 0,
  } = data || {};
  const [weight, setWeight] = useState<string>(uWeight?.toString());
  const [height, setHeight] = useState<string>(uHeight?.toString());
  const [type, setType] = useState<string>(diabetes_type?.toString());
  const [updateUser, { isLoading, isSuccess }] =
    userApi.useUpdateUserMutation();
  const [glucoseRange, setGlucoseRange] = useState<{
    min: number;
    max: number;
  }>({
    min: glucose_min,
    max: glucose_max,
  });

  const [date, setDate] = useState(new Date(birth_date));
  const { Layout, Colors } = useTheme();

  useEffect(() => {
    if (isSuccess) {
      store.dispatch(
        setNotification({
          preset: Incubator.ToastPresets.SUCCESS,
          message: 'Se han actualizado los datos correctamente.',
        })
      );
    }
  }, [isSuccess]);

  const renderMask = (value: string, maskTick: string) => (
    <View style={[Layout.rowHCenter]}>
      <Text style={styles.mask} center text60>
        {value || '0'}
        {maskTick}
      </Text>
    </View>
  );

  const handleUpdate = async () => {
    const data: User = {
      id: user?.uid,
      diabetes_type: Number(type),
      birth_date: date,
      on_boarding: true,
      weight: Number(weight),
      height: Number(height),
      glucose_min: glucoseRange.min,
      glucose_max: glucoseRange.max,
    };

    try {
      if (name !== user?.displayName) {
        await user?.updateProfile({ displayName: name });
      }
      await updateUser(data);
      refetchFn();
    } catch {
      store.dispatch(
        setNotification({
          preset: Incubator.ToastPresets.FAILURE,
          message: 'Hubo un error al actualizar los datos.',
        })
      );
    }
  };

  const handleOnChange = (
    value: string,
    setState: (value: string) => void
  ): void => setState(value);
  const renderSection = () => {
    switch (page) {
      case PageSection.SETTINGS:
        return (
          <>
            <Text>Settings</Text>
          </>
        );
      case PageSection.PERSONAL_DATA:
        return (
          <>
            <Text style={styles.title}>Datos Personales</Text>
            <View style={{ ...styles.picker, ...styles.margin }}>
              <View style={styles.text}>
                <Text>Nombre: </Text>
              </View>
              <TextField
                style={styles.input}
                underlineColor="transparent"
                underlineColorAndroid="transparent"
                migrate
                value={name}
                placeholder="Nombre"
                onChangeText={(value: string) => handleOnChange(value, setName)}
                enableErrors
                validate={['required', (value: string) => value.length > 3]}
                validationMessage={[
                  'Este campo es requerido',
                  'El texto debe ser mayor a 3 caracteres',
                ]}
                validateOnChange
                maxLength={30}
              />
            </View>
            <View style={{ ...styles.picker, ...styles.margin }}>
              <View style={styles.text}>
                <Text>Fecha de nacimiento: </Text>
              </View>
              <DateTimePicker
                underlineColor="transparent"
                underlineColorAndroid="transparent"
                style={styles.input}
                onChange={(date: Date): void => setDate(date)}
                value={date}
                mode="date"
              />
            </View>
            <View style={styles.margin}>
              <View style={styles.text}>
                <Text>Peso: </Text>
              </View>
              <MaskedInput
                containerStyle={styles.input}
                migrate
                renderMaskedText={() => renderMask(weight, 'KG')}
                onChange={(
                  e: NativeSyntheticEvent<TextInputChangeEventData>
                ): void => handleOnChange(e.nativeEvent.text, setWeight)}
                maxLength={10}
                keyboardType={'numeric'}
                value={weight}
              />
            </View>
            <View style={styles.margin}>
              <View style={styles.text}>
                <Text>Altura: </Text>
              </View>
              <MaskedInput
                containerStyle={styles.input}
                migrate
                renderMaskedText={() => renderMask(height, 'CM')}
                onChange={(
                  e: NativeSyntheticEvent<TextInputChangeEventData>
                ): void => handleOnChange(e.nativeEvent.text, setHeight)}
                maxLength={10}
                keyboardType={'numeric'}
                value={height}
              />
            </View>
            <View>
              <View style={styles.text}>
                <Text>Tipo de diabetes: </Text>
              </View>
              <Picker
                value={type}
                useWheelPicker
                labelStyle={{
                  color: Colors.primary,
                }}
                migrateTextField
                underlineColor="transparent"
                underlineColorAndroid="transparent"
                style={styles.input}
                mode={PickerModes.SINGLE}
                placeholder={'Selecciona un tipo'}
                onChange={(e: string): void =>
                  handleOnChange(e as string, setType)
                }
                topBarProps={{
                  doneLabel: 'Done  ',
                }}
              >
                <Picker.Item label="Diabetes tipo 1" value="0" />
                <Picker.Item label="Diabetes tipo 2" value="1" />
              </Picker>
            </View>
            <View>
              <View style={styles.text}>
                <Text>Rango de glucosa: </Text>
              </View>
              <SliderContainer
                onValueChange={(value: number[]): void => {
                  const [min, max] = value;
                  setGlucoseRange({ min, max });
                }}
                sliderValue={[glucoseRange.min, glucoseRange.max]}
              >
                <Slider maximumValue={200} minimumValue={0} step={1} />
              </SliderContainer>
            </View>
            <FormButton
              label="Actualizar datos personales"
              onPress={handleUpdate}
              labelStyle={styles.button}
              noMarginBottom
              backgroundColor={Colors.red}
            />
            {isLoading && (
              <ActivityIndicator
                style={styles.done}
                size="small"
                color={Colors.black}
              />
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <BackButton
        customBack={() => handleBack(undefined)}
        customStyles={styles.back}
      />
      <ScrollView
        contentContainerStyle={[Layout.colCenter, { paddingBottom: 100 }]}
      >
        {renderSection()}
      </ScrollView>
    </>
  );
};

export default UserContainer;
