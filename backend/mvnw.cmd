@IF "%DEBUG%" == "" @ECHO OFF
set ERROR_CODE=0
if "%OS%"=="Windows_NT" @setlocal

set "DIRNAME=%~dp0"
if "%DIRNAME%" == "" set DIRNAME=.
set "MAVEN_HOME=%DIRNAME%.mvn\apache-maven-3.9.9"

if exist "%MAVEN_HOME%\bin\mvn.cmd" goto runMvn

echo [ShopSphere] Setting up Apache Maven 3.9.9 in %MAVEN_HOME%...
powershell -NoProfile -ExecutionPolicy Bypass -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; $dest = '%DIRNAME%.mvn'; New-Item -ItemType Directory -Force -Path $dest | Out-Null; $zip = Join-Path $dest 'apache-maven-3.9.9-bin.zip'; if (!(Test-Path $zip)) { Write-Host 'Downloading Apache Maven...'; Invoke-WebRequest -Uri 'https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.9/apache-maven-3.9.9-bin.zip' -OutFile $zip -UseBasicParsing }; Write-Host 'Extracting Maven...'; Expand-Archive -Path $zip -DestinationPath $dest -Force"

if not exist "%MAVEN_HOME%\bin\mvn.cmd" (
    echo [ShopSphere] Error: Could not prepare Maven.
    goto error
)

:runMvn
"%MAVEN_HOME%\bin\mvn.cmd" %*
if ERRORLEVEL 1 goto error
goto end

:error
set ERROR_CODE=1

:end
@endlocal & set ERROR_CODE=%ERROR_CODE%
exit /B %ERROR_CODE%
