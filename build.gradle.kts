import org.jetbrains.kotlin.gradle.dsl.JvmTarget

plugins {
    kotlin("jvm") version "2.1.21"
    kotlin("plugin.serialization") version "2.1.21"
    application
}

group = "com.xentra"
version = "1.0.0"

val ktorVersion = "3.1.3"

application {
    mainClass.set("com.xentra.ApplicationKt")
}

repositories {
    mavenCentral()
}

dependencies {
    // Ktor (servidor)
    implementation("io.ktor:ktor-server-core-jvm:$ktorVersion")
    implementation("io.ktor:ktor-server-netty-jvm:$ktorVersion")
    implementation("io.ktor:ktor-server-content-negotiation-jvm:$ktorVersion")
    implementation("io.ktor:ktor-serialization-kotlinx-json-jvm:$ktorVersion")
    implementation("io.ktor:ktor-server-status-pages-jvm:$ktorVersion")
    implementation("io.ktor:ktor-server-cors-jvm:$ktorVersion")
    implementation("io.ktor:ktor-server-call-logging-jvm:$ktorVersion")

    // Firebase Admin SDK (Auth + Realtime Database)
    implementation("com.google.firebase:firebase-admin:9.4.3")

    // Logs
    implementation("ch.qos.logback:logback-classic:1.5.18")

    // Pruebas
    testImplementation("io.ktor:ktor-server-test-host-jvm:$ktorVersion")
    testImplementation(kotlin("test"))
}

// Compila para Java 17 (funciona con JDK 17, 21 o superior)
java {
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
}
kotlin {
    compilerOptions { jvmTarget.set(JvmTarget.JVM_17) }
}

// Genera un .jar ejecutable con todas las dependencias: ./gradlew fatJar
tasks.register<Jar>("fatJar") {
    group = "build"
    archiveClassifier.set("server")
    duplicatesStrategy = DuplicatesStrategy.EXCLUDE
    manifest { attributes["Main-Class"] = "com.xentra.ApplicationKt" }
    from(sourceSets.main.get().output)
    dependsOn(configurations.runtimeClasspath)
    from({ configurations.runtimeClasspath.get().filter { it.name.endsWith("jar") }.map { zipTree(it) } }) {
        exclude("META-INF/*.SF", "META-INF/*.DSA", "META-INF/*.RSA")
    }
}
