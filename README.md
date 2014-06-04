Carte de localisation des membres LBM
========================

Le projet est un projet symfony vous trouverez ci dessous la procédure d'installation de symfony.

1) Requis 
-----------------------------------

Un serveur web, style wamp ou autre avec php et base de donnée.
Si vous êtes sur windows, vous aurez besoin d'avoir php dans votre variable d'environnement PATH.
Il sera plus facile pour vous aussi d'avoir composer d'installé 
 voir [installer composer](http://www.evoluation.com/blog/2012/06/installer-et-utiliser-composer-en-php/)

Evidement avoir git d'installé : voir [installation et téléchargement de git](http://git-scm.com/downloads)

2) Récupération du projet 
-----------------------------------
forkez ensuite le projet sur git voir [faire un fork sous git](https://help.github.com/articles/fork-a-repo) 

3) Config et installation
-----------------------------------
```
composer selfupdate
composer install

php app/console doctrine:schema:create
php app/console doctrine:schema:update
php app/console assets:install --symlink
```
et voila ;)

pour la doc concernant symfony 2 :

http://symfony.com/
