HEAD
const MyComponent = React.lazy(() => import('./MyComponent'));

function App() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <MyComponent />
        </Suspense>
    );
}

const MyComponent = React.lazy(() => import('./MyComponent'));

function App() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <MyComponent />
        </Suspense>
    );
}
(Add new files and update configuration for deployment)
