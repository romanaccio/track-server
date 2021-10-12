import express = require('express');
import mongoose = require('mongoose');
require('./models/User'); // ne doit pas être importé car doit être chargé une unique fois dans l'app
require('./models/Track'); // ne doit pas être importé car doit être chargé une unique fois dans l'app
import authRoutes = require('./routes/authRoutes');
import requireAuth = require('./middlewares/requireAuth');
import trackRoutes = require('./routes/trackRoutes');

class App {
  public express;
  constructor() {
    this.express = express();
    this.mountRoutes();
    this.connectToMongo();
  }

  private connectToMongo(): void {
    const mongoUri = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPASSWORD}@cluster0.dukb9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
    // console.log(mongoUri);
    mongoose.connect(mongoUri);
    mongoose.connection.on('connected', () => console.log('Connecté à Atlas'));
    mongoose.connection.on('error', (error) =>
      console.error('Erreur de connexion à Atlas:', error)
    );
  }
  private mountRoutes(): void {
    const router = express.Router();
    this.express.get('/', requireAuth, (req, res) => {
      res.send(`Hi there! You are authenticated with email ${req.user.email}`);
    });

    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: true }));
    this.express.use(authRoutes);
    this.express.use(trackRoutes);
  }
}
export default new App().express;
