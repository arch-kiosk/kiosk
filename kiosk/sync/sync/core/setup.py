from distutils.core import setup

setup(name='architecture_core',
      version='0.4.3',
      py_modules=['config',
                  'configchecker',
                  'eventmanager',
                  'logginglib',
                  'plugin',
                  'pluginmanager',
                  'typerepository',
                  'yamlconfigreader',
                  'dicttools',
                  'statemachine',],
      )

