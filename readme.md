# Ordonnancement des Examens - Projet de Planification Automatique

Ce projet permet de gérer l'ordonnancement des examens d'une école ou université. Il prend en compte les examens à programmer, les salles disponibles, les surveillants et les créneaux horaires pour créer un emploi du temps optimisé.

## Fonctionnalités

- **Gestion des examens** : Définir des examens avec leur durée, niveau et département.
- **Attribution des salles** : Assigner automatiquement des salles disponibles en fonction de la capacité et des exigences des examens.
- **Surveillants** : Assigner des surveillants aux examens de manière optimisée.
- **Créneaux horaires** : Planifier les examens en fonction des créneaux horaires disponibles.
- **Affichage de l'emploi du temps** : Générer un emploi du temps pour chaque examen, salle, créneau horaire et surveillant.

## Structure du Projet

Voici la structure du projet :

```
exam_scheduler/
├── main.py               # Point d'entrée pour exécuter l'application et tester
├── scheduler.py          # Contient la logique du planificateur d'examen
├── models.py             # Contient les classes des objets : Examen, Salle, Surveillant, Créneau
└── test_data.py          # Contient les données fictives pour les tests
```

## Prérequis

Avant de commencer, assurez-vous que vous avez Python installé. Vous pouvez télécharger Python depuis [python.org](https://www.python.org/downloads/).

Il est également recommandé d'utiliser un environnement virtuel pour installer les dépendances.

### Installation des dépendances

1. Clonez ce dépôt sur votre machine :

```bash
git clone https://votre-repository-url.git
cd exam_scheduler
```

2. Créez un environnement virtuel (optionnel mais recommandé) :

```bash
python -m venv venv
source venv/bin/activate  # Sous macOS/Linux
venv\Scripts\activate     # Sous Windows
```

3. Installez les dépendances nécessaires (si vous en avez dans un fichier `requirements.txt`, sinon c'est optionnel pour ce projet) :

```bash
pip install -r requirements.txt
```

## Utilisation

### 1. Ajouter des données fictives

Les données fictives pour tester le système sont dans le fichier `test_data.py`. Voici un aperçu des données définies dans ce fichier :

- **Examen** : Définit les examens à planifier avec leur durée, niveau et département.
- **Salle** : Liste des salles disponibles avec leur capacité.
- **Surveillant** : Liste des surveillants disponibles.
- **Créneau horaire** : Liste des créneaux horaires pour planifier les examens.

### 2. Exécuter le planificateur

Pour exécuter le programme et voir l'emploi du temps généré, il suffit de lancer le fichier `main.py` :

```bash
python main.py
```

Cela exécutera le processus d'ordonnancement et affichera les résultats dans la console.

### Exemple de sortie

```
Examen 1 dans la salle 1 à 2025-03-11 08:00:00 - 2025-03-11 10:30:00
Surveillants assignés: 1, 2
Examen 2 dans la salle 2 à 2025-03-11 10:00:00 - 2025-03-11 11:00:00
Surveillants assignés: 3
Examen 3 dans la salle 3 à 2025-03-11 14:00:00 - 2025-03-11 16:00:00
Surveillants assignés: 2
```

## Structure du Code

### **1. Fichier `models.py`**

Ce fichier contient les classes qui modélisent les objets du système, à savoir :

- **`Exam`** : Représente un examen avec des propriétés comme la durée, le niveau et le département.
- **`Room`** : Représente une salle avec un identifiant et une capacité.
- **`Proctor`** : Représente un surveillant.
- **`TimeSlot`** : Représente un créneau horaire, avec une méthode pour calculer l'heure de fin d'un examen en fonction de sa durée.

### **2. Fichier `scheduler.py`**

Le fichier `scheduler.py` contient la logique principale de planification :

- La classe **`ExamScheduler`** prend les examens, les salles, les surveillants et les créneaux horaires, puis attribue des créneaux et des salles aux examens.
- La méthode **`create_schedule`** génère l'emploi du temps en assignant des salles, des surveillants et des créneaux horaires aux examens, tout en respectant la capacité des salles et les disponibilités des surveillants.

### **3. Fichier `test_data.py`**

Ce fichier contient des données fictives pour tester l'application. Il inclut des listes d'examens, de salles, de surveillants et de créneaux horaires. Ces données sont utilisées pour vérifier que l'algorithme fonctionne correctement.

### **4. Fichier `main.py`**

Le fichier principal qui exécute le processus d'ordonnancement. Il crée une instance du planificateur (`ExamScheduler`), appelle la méthode `create_schedule` pour générer l'emploi du temps et affiche les résultats.

## Tester et Personnaliser

- Vous pouvez facilement modifier les données dans `test_data.py` pour tester d'autres configurations.
- Ajoutez ou modifiez les examens, salles, surveillants ou créneaux horaires en fonction de vos besoins.
- La méthode `create_schedule` peut être étendue pour inclure plus de règles ou de fonctionnalités, comme la gestion des conflits de créneaux ou des priorités.

## Contributions

Les contributions sont les bienvenues ! Si vous avez des idées d'améliorations ou des fonctionnalités à ajouter, n'hésitez pas à ouvrir une **pull request**.

## License

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

```

---

### Explications supplémentaires sur le `README.md` :

- **Fonctionnalités** : Une description des principales capacités du système d'ordonnancement.
- **Installation** : Explication sur comment cloner le projet, créer un environnement virtuel et installer les dépendances.
- **Utilisation** : Instructions sur la manière d'exécuter le projet et tester les résultats.
- **Structure du Code** : Une brève explication de la structure des fichiers et des classes du projet.
- **Test et Personnalisation** : Explications sur la personnalisation des données pour tester différents scénarios.
- **Contributions** : Invitation aux autres développeurs à contribuer au projet.
  
Cela permet à toute personne souhaitant tester ou contribuer à votre projet de le comprendre rapidement et d’interagir avec le code efficacement.