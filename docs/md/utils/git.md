<p style="text-align: right">2022-04-28</p>

### git 버전 업그레이드

```bash
$ add-apt-repository ppa:git-core/ppa
$ apt update
$ apt install git
```

### 사용자 정보 등록

```bash
$ git config --global user.name {user-name}
$ git config --global user.email {user-email}
```

### commit 복원

https://gmlwjd9405.github.io/2018/05/25/git-add-cancle.html

```bash
$ git reset --mixed HEAD
$ git reset --soft HEAD
$ git reset --hard HEAD

$ git push origin [branch name] -f
```

### git reset으로 사라진 commit 리스트 보기

https://stackoverflow.com/questions/4786972/get-a-list-of-all-git-commits-including-the-lost-ones \
https://git-scm.com/docs/git-log

Pretend as if all objects mentioned by reflogs are listed on the command line as &lt;commit&gt;

```bash
$ git log --reflog
$ git log --graph --all --oneline --reflog
```

### 접근할 수 없는 commit 제거

https://stackoverflow.com/questions/49067898/git-remove-old-reflog-entries

```bash
$ git reflog expire --expire=90.days.ago --expire-unreachable=now --all
$ git reflog expire --expire=all

$ git reflog expire --expire=now --all
$ git gc --prune=now
```
