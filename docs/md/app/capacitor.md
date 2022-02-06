<p style="text-align: right">2022-02-06</p>

https://capacitorjs.com/docs

# Installing Capacitor

```bash
$ npm install @capacitor/core
$ npm install @capacitor/cli --save-dev
$ npm install @capacitor/android

$ mkdir www
$ npx cap init

$ npx cap add android
$ npx cap open android  # Android Studio가 열림
$ npx cap run android   # 빌드시 gradlew가 실행됨
```

## JDK

JAVA_HOME이 설정되어 있으면 해당경로의 JDK를 사용하고, 환경변수 path에 포함된 java.exe를 사용한다. Windows에 Android Studio가 설치된 경우 Android Studio default JDK 경로는 아래와 같다.

```
C:\Program Files\Android\Android Studio\jre
```

사용 JDK가 적합하지 않아서 에러를 발생시키면 android 폴더내의 gradle.properties 파일설정을 수정한다.

```
org.gradle.java.home=C:/Program Files/Android/Android Studio/jre
```

## Gradle Wrapper

Windows에 Android Studio가 설치된 경우 Gradle의 기본 설치 경로는 아래와 같다. 해당 Gradle은 Gradle Wrapper를 통해 자동으로 다운 받는다. 참고로 환경변수 GRADLE_USER_HOME의 기본값은 $USER_HOME/.gradle 이다.

```
C:\Users\{user}\.gradle\wrapper\dists\gradle-{version}\xxx...\gradle-{version}
```

# Capacitor Workflow

https://capacitorjs.com/docs/basics/workflow

- Develop and build your Web App \
  To deploy your web app to native devices, you will first need to build the web assets into an output directory. Consult your JavaScript framework’s documentation for the exact command. For most, it’s <code>npm run build</code>.

- Sync your Project
- Run your Project
- Build your Project

# Capacitor Plugins

https://capacitorjs.com/docs/plugins

Webpack을 사용해서 npm package을 Bundling하는 과정이 필요하다.

## @capacitor/app

https://capacitorjs.com/docs/apis/app

```bash
npm install @capacitor/app
npx cap sync
```

### Android

AndroidManifest.xml

```xml
<activity>
  ...
  <intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="@string/custom_url_scheme" />
  </intent-filter>
</activity>
```

## @capacitor/camera

https://capacitorjs.com/docs/apis/camera

```bash
npm install @capacitor/camera
npx cap sync
```

### Android

AndroidManifest.xml

```xml
<manifest>
  ...
  <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
  <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
</manifest>
```

Because the Camera API launches a separate Activity to handle taking the photo, you should listen for appRestoredResult in the App plugin to handle any camera data that was sent in the case your app was terminated by the operating system while the Activity was running.
