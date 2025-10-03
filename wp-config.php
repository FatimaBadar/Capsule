<?php
define( 'WP_CACHE', true );

/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the website, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://developer.wordpress.org/advanced-administration/wordpress/wp-config/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'capsule' );

/** Database username */
define( 'DB_USER', 'root' );

/** Database password */
define( 'DB_PASSWORD', '' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'jyZEwLd3+y`Bd3C5g.vb_iVz:T.KY~3]}l7*e4Ns?rIO(viR@<H}z<SKCi3$C2RR' );
define( 'SECURE_AUTH_KEY',  'dby&5M9y%-thZc*<(?Wgx&VEE#gaOx},kaiiRQA2RK6uq[]SkG3c}a=zEzE_bt{A' );
define( 'LOGGED_IN_KEY',    'n~@O]9n$eV:qnb1iS<-6QZo3thY6M(F.2Y^*S,:aob]86{<z]t[*#*P,qx&)^wOy' );
define( 'NONCE_KEY',        '%geW0$7|S|OfEA0boAvY27m*RA>$OS^oQ|b|1?[uq&S:#0>3n +)TkiX?D.1UkOU' );
define( 'AUTH_SALT',        '1}Sp.!^9S$U}0Gb@g*fdrEu/rL +jY6+I8aP9?*Q/yGFdDn8}va(^<-mNSg7KJFA' );
define( 'SECURE_AUTH_SALT', 'pbfEpUfxfFJ+%@s,{Z}~6(s=y]ywf;v^-<xHXP5.BSQ^J-Z,0[Hvbqaa+pFFiVTF' );
define( 'LOGGED_IN_SALT',   'iEV-rJ,&c]G$(L3PdAM8ZXMz SzN;gK/8s0];>M>W35c2*XX%megDk7N@%~RXFVY' );
define( 'NONCE_SALT',       '*+L!C-OLZ.x =H*<=3.|qeV.l?Gy7D|8i6k>!ad]3<`M;}9+Jx$MuLWYEL}~?o/|' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 *
 * At the installation time, database tables are created with the specified prefix.
 * Changing this value after WordPress is installed will make your site think
 * it has not been installed.
 *
 * @link https://developer.wordpress.org/advanced-administration/wordpress/wp-config/#table-prefix
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://developer.wordpress.org/advanced-administration/debug/debug-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
