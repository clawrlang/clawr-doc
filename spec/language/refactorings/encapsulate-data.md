&nbsp; / &nbsp; [The Clawr Language](../README.md) &nbsp; / &nbsp; [Refactorings](./README.md)

# Encapsulate Data

Encapsulate Data is a refactoring technique that converts a naked data structure into an object with controlled access to its internal state.

## Example

Before encapsulation:

```clawr
data Person {
    name: string
    age: integer (18...150)
}
```

After encapsulation:

```clawr
object Person {
    func name() => self.name
    func age() => self.age

state:
    name: string
    age: integer (18...150)
}
```

## Step 1: Find Usages

Before refactoring, identify places where the `data` type is used and constructed. These places will need to be changed progressively, one by one, to use the new `object` type.

```clawr
const alice: Person = { name: "Alice", age: 30 }
const bob: Person = { name: "Bob", age: 25 }

func processPeople() {
    const people = [alice, bob]
    for person in people {
        printPerson(person)
    }
}

func printPerson(p: Person) {
    println("Name: \(p.name), Age: \(p.age)")
}
```

## Step 2: Create a new `object` Type

The first step is to create a new `object` type whose state is the entire `data` previously defined. This `object` will provide controlled access through methods.

```clawr
object EncapsulatedPerson {
    func state() => self.state
    func name() => self.state.name
    func age() => self.state.age

init:
    func fromState(state: Person) => { state }
    func new(name: string, age: integer (18...150)) => { state: { name, age } }

state:
    state: Person
}
```

The new `EncapsulatedPerson` object stores an entire `Person` structure internally, providing controlled access to its fields through methods rather than exposing them directly. It also provides an initializer and a `state()` method so that code that relies on the old structure can still function correctly without changes.

## Step 3: Update Usages

The point of refactoring is that you do not need to change every usage of the `data` type immediately. You can gradually update the code to use the new `object` type, ensuring that all access to the internal state goes through the controlled methods.

For example, in the `processPeople` function, you can create a temporary `EncapsulatedPerson` from the existing `Person` data and start using the new access methods instead of directly accessing the properties. If you have multiple places where the `printPerson` function is used, you can start by creating a new function `printEncapsulatedPerson` and gradually replace the old usages.

```clawr
const alice: Person = { name: "Alice", age: 30 }
const bob: Person = { name: "Bob", age: 25 }

func printPerson(p: Person) {
    println("Name: \(p.name), Age: \(p.age)")
}
func printEncapsulatedPerson(p: EncapsulatedPerson) {
    println("Name: \(p.name()), Age: \(p.age())")
}

func processPeople() {
    const people = [alice, bob]
    for person in people {
        const encapsulatedPerson = { EncapsulatedPerson.fromState(state: person) }
        printEncapsulatedPerson(encapsulatedPerson)
    }
}
```

Keeping the original `printPerson` function allows you to continue using the old `data` type where needed, while gradually transitioning to the new `EncapsulatedPerson` object. This approach minimizes disruption and ensures a smooth refactoring process.

Once all usages of `printPerson` have been updated to use `printEncapsulatedPerson`, you can safely remove the old function. At that point you may want to rename `printEncapsulatedPerson` to `printPerson` to maintain consistency with the original naming.

## Step 4: Update Construction

Pick one place where a `Person` is constructed and update it to use the new `EncapsulatedPerson` object instead. This ensures that new instances are created with controlled access from the start. When a `Person` is requested, you can extract the internal state from the encapsulated object using the `state()` method.

```clawr
const alice = { EncapsulatedPerson.new(name: "Alice", age: 30) }
const bob: Person = { name: "Bob", age: 25 }

func printEncapsulatedPerson(p: EncapsulatedPerson) {
    println("Name: \(p.name()), Age: \(p.age())")
}

func processPeople() {
    const people = [alice.state(), bob]
    for person in people {
        const encapsulatedPerson = { EncapsulatedPerson.fromState(state: person) }
        printEncapsulatedPerson(encapsulatedPerson)
    }
}
```

You can migrate existing `Person` constructions to use the new `EncapsulatedPerson` object by replacing the direct state initialization with the `EncapsulatedPerson.new` initializer. When all constructions have been updated, you can remove the `fromState` one.

```clawr
object EncapsulatedPerson {
    func state() => self.state
    func name() => self.state.name
    func age() => self.state.age

init:
    // func fromState(state: Person) => { state } // removed
    func new(name: string, age: integer (18...150)) => { state: { name, age } }

state:
    state: Person
}
```

## Step 5: Cleanup

Eventually, you will have migrated all code to use the `EncapsulatedPerson` object exclusively, eliminating the need for direct `Person` state manipulation.

```clawr
const alice = { EncapsulatedPerson.new(name: "Alice", age: 30) }
const bob = { EncapsulatedPerson.new(name: "Bob", age: 25) }

func printEncapsulatedPerson(p: EncapsulatedPerson) {
    println("Name: \(p.name()), Age: \(p.age())")
}

func processPeople() {
    const people = [alice, bob]
    for person in people {
        printEncapsulatedPerson(person)
    }
}

object EncapsulatedPerson {
    func name() => self.state.name
    func age() => self.state.age

init:
    func new(name: string, age: integer (18...150)) => { state: { name, age } }

state:
    state: Person
}
```

## Step 6: Remove the `Person` type

Now that all uses of the `Person` type have been replaced with `EncapsulatedPerson`, you should have no use for the `Person` type anymore outside the `EncapsulatedPerson` object. The final step is to replace the `state` property within `EncapsulatedPerson` with the explicit properties `name` and `age`.

Because the `EncapsulatedPerson` is encapsulated, its internal state is hidden from external code. The changes to the internal representation, cannot affect any code that uses the `EncapsulatedPerson` object, as long as the public interface remains consistent.

```clawr
const alice = { EncapsulatedPerson.new(name: "Alice", age: 30) }
const bob = { EncapsulatedPerson.new(name: "Bob", age: 25) }

func printEncapsulatedPerson(p: EncapsulatedPerson) {
    println("Name: \(p.name()), Age: \(p.age())")
}

func processPeople() {
    const people = [alice, bob]
    for person in people {
        printEncapsulatedPerson(person)
    }
}

object EncapsulatedPerson {
    func name() => self.name
    func age() => self.age

init:
    func new(name: string, age: integer (18...150)) => { name, age }

state:
    name: string
    age: integer (18...150)
}
```

With this final change, the `Person` type is no longer needed, and can be removed. You may want to rename the `EncapsulatedPerson` object to simply `Person` to signal that the refactoring is at an end.
