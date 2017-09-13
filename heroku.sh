git add .
git commit -m "pushing to heroku"
git push
git push heroku heroku:master --force
heroku open