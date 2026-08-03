[app]

# (str) Title of your application
title = Student Academic Planner

# (str) Package name
package.name = studentacademicplanner

# (str) Package domain (needed for android packaging)
package.domain = com.academicplanner

# (str) Source code directory
source.dir = .

# (list) Source files to include (empty means include all)
source.include_exts = py,png,jpg,kv,atlas,html,js,css,json,svg,ico,woff,woff2,ttf,eot,map,cjs

# (list) List of inclusions using pattern matching
source.include_patterns = dist/*,dist/**/*

# (str) Application versioning
version = 1.0.0

# (list) Application requirements
requirements = python3,kivy,android,pyjnius

# (str) Supported orientation (one of landscape, sensorLandscape, portrait or all)
orientation = portrait

# (bool) Indicate if the application should be fullscreen or not
fullscreen = 0

# (list) Permissions
android.permissions = INTERNET

# (int) Target Android API
android.api = 33

# (int) Minimum API your APK will support
android.minapi = 21

# (bool) Enable AndroidX support
android.enable_androidx = True

# (list) Architectures to build for
android.archs = arm64-v8a

# (bool) Accept SDK licenses automatically
android.accept_sdk_license = True

[buildozer]

# (int) Log level (0 = error only, 1 = info, 2 = debug)
log_level = 2

# (int) Display warning if buildozer is run as root
warn_on_root = 1
