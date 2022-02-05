<p style="text-align: right">2022-02-05</p>

# Gradle

https://gradle.org/

Gradle is an open-source build automation tool.

## Gradle Installation

https://gradle.org/install/

### Prerequisites

Gradle runs on all major operating systems and requires only a Java JDK version 8 or higher to be installed.

```bash
$ java -version
```

Windows에 Android Studio가 설치된 경우 Android Studio default JDK 경로는 아래와 같고, 해당 폴더내에 bin폴더를 path 환경변수에 포함시킨다.

```
C:\Program Files\Android\Android Studio\jre
```

### Installing

```bash
$ sdk install gradle 7.3.3 # Unix-based systems
$ brew install gradle # macOS
```

Windows에 Android Studio가 설치된 경우 Gradle의 기본 설치 경로는 아래와 같고, 해당 폴더내에 bin폴더를 path 환경변수에 포함시킨다. 해당 Gradle은 Gradle Wrapper를 통해 자동으로 다운 받는다. 참고로 환경변수 GRADLE_USER_HOME의 기본값은 $USER_HOME/.gradle 이다.

```
C:\Users\{user}\.gradle\wrapper\dists\gradle-{version}\xxx...\gradle-{version}
```

## Gradle Guides

https://docs.gradle.org/current/userguide/userguide.html

### Five things you need to know about Gradle

1. Gradle is a general-purpose build tool
2. The core model is based on tasks
3. Gradle has several fixed build phases
4. Gradle is extensible in more ways than one
5. Build scripts operate against an API

### Authoring Gradle Builds

https://docs.gradle.org/current/userguide/tutorial_using_tasks.html

#### Projects, plugins and tasks

Every Gradle build is made up of one or more projects. The work that Gradle can do on a project is defined by one or more tasks. Typically, tasks are provided by applying a plugin so that you do not have to define them yourself.

#### Hello world

You run a Gradle build using the gradle command. The gradle command looks for a file called build.gradle (build configuration script) in the current directory. The build script defines a project and its tasks.

```gradle
// build.gradle
tasks.register('hello') {
  doLast {
    println 'Hello world!'
  }
}
```

```bash
$ gradle -q hello
```

When you run gradle hello, Gradle executes the hello task, which in turn executes the action you’ve provided. The action is simply a block containing some code to execute.

#### Build scripts are code

```gradle
defaultTasks 'hello', 'count'

tasks.register('upper') {
  doLast {
    String someString = 'mY_nAmE'
    println "Original: $someString"
    println "Upper case: ${someString.toUpperCase()}"
  }
}

tasks.register('count') {
  doLast {
    4.times { print "$it " }
  }
}

tasks.register('hello') {
  doLast {
    println 'Hello Earth'
  }
}

tasks.named('hello') {
  doFirst {
    println 'Hello Venus'
  }
}

tasks.named('hello') {
  doLast {
    println 'Hello Mars'
  }
}

tasks.register('intro') {
  dependsOn tasks.hello
  doLast {
    println "I'm Gradle"
  }
}
```

#### External dependencies for the build script

If your build script needs to use external libraries, you can add them to the script's classpath in the build script itself. You do this using the buildscript() method, passing in a block which declares the build script classpath.

```gradle
import org.apache.commons.codec.binary.Base64

buildscript {
  repositories {
    mavenCentral()
  }
  dependencies {
    classpath group: 'commons-codec', name: 'commons-codec', version: '1.2'
  }
}

tasks.register('encode') {
  doLast {
    def byte[] encodedString = new Base64().encode('hello world\n'.getBytes())
    println new String(encodedString)
  }
}
```

```bash
$ gradle -q encode
```

https://groovy-lang.org/syntax.html

## Building Java Applications Sample

https://docs.gradle.org/current/samples/sample_building_java_applications.html

### Run the init task

```bash
$ gradle init
# type of project           2: application
# implementation language   3: Java
# build script DSL          1: Groovy
# default values for the other questions
```

```bash
├── gradle            # Folder for wrapper files
│   └── wrapper
│       ├── gradle-wrapper.jar
│       └── gradle-wrapper.properties
├── gradlew           # Gradle wrapper start scripts (bash)
├── gradlew.bat       # Gradle wrapper start scripts (cmd)
├── settings.gradle   # Settings file to define build name and subprojects
└── app
    ├── build.gradle  # Build script of app project
    └── src
        ├── main
        │   └── java  # Default Java source folder
        │       └── demo
        │           └── App.java
        └── test
            └── java  # Default Java test source folder
                └── demo
                    └── AppTest.java
```

### Review the project files

```gradle
// settings.gradle
rootProject.name = 'demo'
include('app')
```

'rootProject.name' assigns a name to the build, which overrides the default behavior of naming the build after the directory it’s in.

'include("app")' defines that the build consists of one subproject called app that contains the actual code and build logic.

```gradle
// app/build.gradle

plugins {
  // Apply the application plugin to add support for building a CLI application in Java.
  id 'application'
}

repositories {
  // Use Maven Central for resolving dependencies.
  mavenCentral()
}

dependencies {
  // Use JUnit Jupiter for testing.
  testImplementation 'org.junit.jupiter:junit-jupiter:5.7.2'

  // This dependency is used by the application.
  implementation 'com.google.guava:guava:30.1.1-jre'
}

application {
  // Define the main class for the application.
  mainClass = 'demo.App'
}

tasks.named('test') {
  useJUnitPlatform()
}
```

'app/build.gradle' configures 'app' subproject.

### Run the application

Thanks to the application plugin, you can run the application directly from the command line.

```bash
$ ./gradlew run
```

### Run the application

```bash
$ ./gradlew build
```

If you run a full build as shown above, Gradle will have produced the archive in two formats for you: 'app/build/distributions/app.tar' and 'app/build/distributions/app.zip'.

### More

https://docs.gradle.org/current/userguide/application_plugin.html

## Building Android Apps Sample

https://docs.gradle.org/current/samples/sample_building_android_apps.html

## Building C++ Applications Sample

https://docs.gradle.org/current/samples/sample_building_cpp_applications.html

## Gradle Wrapper

https://docs.gradle.org/current/userguide/gradle_wrapper.html

Gradle이 미리 설치가 안되있어도 Gradle Wrapper를 사용하면 자동설치 및 사용이 가능하다. 또한 Gradle Wrapper를 생성한 Gradle 버전을 설치하므로 동일한 환경에서 빌드할 수 있다.

```bash
$ gradle wrapper
```

Linux용 gradlew 파일과 Windows용 gradlew.bat이 생성되고 gradlew 명령으로 gradle와 동일한 기능을 수행할 수 있다.

## Build Environment

https://docs.gradle.org/current/userguide/build_environment.html

When configuring Gradle behavior you can use these methods, listed in order of highest to lowest precedence (first one wins):

- Command-line flags such as --build-cache.
- System properties such as systemProp.http.proxyHost=somehost.org stored in a gradle.properties file.

- Gradle properties such as org.gradle.caching=true that are typically stored in a gradle.properties file in a project root directory or GRADLE_USER_HOME environment variable.

- Environment variables such as GRADLE_OPTS sourced by the environment that executes Gradle.

### Gradle properties

The following properties can be used to configure the Gradle build environment:

- org.gradle.java.home=(path to JDK home) \
  Specifies the Java home for the Gradle build process. This does not affect the version of Java used to launch the Gradle client VM (see Environment variables).

```
org.gradle.java.home=C\:\\Program Files\\Android\\Android Studio\\jre
```

- org.gradle.jvmargs=(JVM arguments) \
  Specifies the JVM arguments used for the Gradle Daemon.

```
org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
```

### Environment variables

- GRADLE_USER_HOME \
  Specifies the Gradle user home directory (which defaults to $USER_HOME/.gradle if not set).

- JAVA_HOME \
  Specifies the JDK installation directory to use for the client VM.
