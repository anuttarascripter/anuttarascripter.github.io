<p style="text-align: right">2022-02-06</p>

https://capacitorjs.com/docs

## Installing Capacitor

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

### JDK

JAVA_HOME이 설정되어 있으면 해당경로의 JDK를 사용하고, 환경변수 path에 포함된 java.exe를 사용한다. Windows에 Android Studio가 설치된 경우 Android Studio default JDK 경로는 아래와 같다.

```
C:\Program Files\Android\Android Studio\jre
```

사용 JDK가 적합하지 않아서 에러를 발생시키면 android 폴더내의 gradle.properties 파일설정을 수정한다.

```
org.gradle.java.home=C:/Program Files/Android/Android Studio/jre
```

### Gradle Wrapper

Windows에 Android Studio가 설치된 경우 Gradle의 기본 설치 경로는 아래와 같다. 해당 Gradle은 Gradle Wrapper를 통해 자동으로 다운 받는다. 참고로 환경변수 GRADLE_USER_HOME의 기본값은 $USER_HOME/.gradle 이다.

```
C:\Users\{user}\.gradle\wrapper\dists\gradle-{version}\xxx...\gradle-{version}
```
