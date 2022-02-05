<p style="text-align: right">2022-02-05</p>

## Windows Batch Scripting

```bat
@REM @ sign to prevent the command from appearing.

@ECHO OFF


REM Changes the active console code page, language
REM https://docs.microsoft.com/en-us/windows/win32/intl/code-page-identifiers

REM OEM United States
CHCP 437
REM ANSI/OEM Korean (Unified Hangul Code)
CHCP 949
REM Unicode (UTF-8)
CHCP 65001


@REM path 환경변수 경로별 한줄 출력
ECHO %path:;=&echo.%
```
