<p style="text-align: right">2022-02-05</p>

## Windows Batch Scripting

https://www.section.io/engineering-education/dive-into-batch-scripting-language/

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


DIR /s
DIR /s "C:\*.mp3"

CHCP 65001 >> "tlog.txt"
DIR "C:\Users" >> "tlog.txt"
DIR %1 > %2

SET evar
SET evar=123
SET evar=

SET TEST=%~dp0
ECHO %~dp0
ECHO %TEST%
```

https://ss64.com/nt/call.html \
https://blog.naver.com/PostView.nhn?blogId=zlatmgpdjtiq&logNo=221469960587
