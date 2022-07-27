class TypeRepository:
    """ Manages classes that implement a certain interface and controls their instantiation. """

    def __init__(self):
        self.repository = {}

    def register_type(self, interface_type, type_name, type_factory):
        """ Registers a class under an interface and a type name """

        if interface_type not in self.repository:
            self.repository[interface_type] = {}
        self.repository[interface_type][type_name] = type_factory

    def get_type(self, interface_type, type_name):
        """ get a class that implements a certain interface and is of the given type name """
        if interface_type in self.repository:
            if type_name in self.repository[interface_type]:
                return self.repository[interface_type][type_name]
        return None

    def list_types(self, interface_type):
        """ list all the classes that implement a certain interface """
        if interface_type in self.repository:
            return list(self.repository[interface_type])

        return []

    def create_type(self, interface_type, type_name, *args, **kwargs):
        """ create a class referred to by interface_type and type_name and give the parameters to the constructor """
        factory_class = self.get_type(interface_type, type_name)
        if factory_class:
            obj = factory_class(*args, **kwargs)
            return obj
        return None
