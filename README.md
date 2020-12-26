**install node in linux**
- in order to install this we  need to install linuxbrew

```
sh -c "$(curl -fsSL https://raw.githubusercontent.com/Linuxbrew/install/master/install.sh)"

export brew=/home/linuxbrew/.linuxbrew/bin

test -d ~/.linuxbrew && eval $(~/.linuxbrew/bin/brew shellenv)

test -d /home/linuxbrew/.linuxbrew && eval $(/home/linuxbrew/.linuxbrew/bin/brew shellenv)

test -r ~/.profile && echo "eval \$($(brew --prefix)/bin/brew shellenv)" >>~/.profile     // for ubuntu and debian
```

then
```
brew install node
```

**install npm in linux**
npm is installed with node but in case you get an error

```
sudo apt-get install npm
```

**install nodemon**
```
sudo npm i -g nodemon
```

**Install redis in linux**

Redis is an in-memory data structure store that can be used as a database, cache & message broker.

Navigate to the directory that you want to download the redis
``` 
wget http://download.redis.io/redis-stable.tar.gz
sudo apt-get install gcc
sudo apt-get install build-essential
sudo apt-get install tcl
tar xvzf redis-stable.tar.gz
cd redis-stable
make

```

**start the redis-server**

``` 
$ redis-server

```

**start the app**


```
npm run dev
```
