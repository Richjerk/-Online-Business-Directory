const MyComponent = React.lazy(() => import('./MyComponent'));

function App() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <MyComponent />
        </Suspense>
    );
}
