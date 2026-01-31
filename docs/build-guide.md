# Android APK Build Guide

This guide explains how to generate a simple Android APK (Application Package) that you can share with family members via WhatsApp, Drive, or Email.

## 1. Prerequisites
You need an **Expo Account** (free) to use their build servers.
1.  Go to [expo.dev](https://expo.dev) and create an account.
2.  Install the EAS CLI globally:
    ```bash
    npm install -g eas-cli
    ```
3.  Login to your account:
    ```bash
    eas login
    ```

## 2. Configuration (Already Done)
We have already:
*   Updated `app.json` with the name "**ShareBoard**" and package ID `com.jd.shareboard`.
*   Created `eas.json` with a specific `"preview"` profile to generate an `.apk` file (instead of the Play Store bundle `.aab`).

## 3. Build Command
To generate the APK, run this command in the `app/` directory:

```bash
cd app
eas build -p android --profile preview
```

### What happens next?
1.  It will ask you to link the project to your Expo account (Say **Yes**).
2.  It will upload your code to Expo's build servers.
3.  Wait ~10-15 minutes.
4.  It will give you a link to download the `.apk` file.

## 4. How to Install
1.  Send the `.apk` file to your family member's phone.
2.  They tap on it.
3.  Android will warn: "Install unknown apps?" -> Allow it.
4.  The app will install as "ShareBoard".

## 5. Metadata Customization
To change the icon or splash screen:
1.  Replace `app/assets/images/icon.png` (1024x1024).
2.  Replace `app/assets/images/splash-icon.png` (200x200).
3.  Run the build command again!
