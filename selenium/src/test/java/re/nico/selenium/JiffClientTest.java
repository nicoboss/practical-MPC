// Basierend auf Roland Gisler's Java Vorlage und der SWT Übung
package re.nico.selenium;

import com.aventstack.extentreports.ExtentReports;
import com.aventstack.extentreports.ExtentTest;
import com.aventstack.extentreports.Status;
import com.aventstack.extentreports.reporter.ExtentHtmlReporter;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.Point;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebDriver.Window;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Stream;

import static java.lang.Integer.parseInt;

public class JiffClientTest {
    private static ExtentReports extent;
    static WebDriver client1_driver;
    static WebDriver client2_driver;
    private static JiffClientTester client1;
    private static JiffClientTester client2;
    
    public static Stream<Arguments> data() {
        var file = "testdaten/client.csv";
        List<Arguments> testParams = new LinkedList<>();

        try (BufferedReader br = new BufferedReader(new FileReader(file))) {
            String currentLine = "";
            while ((currentLine = br.readLine()) != null) {
                var splittedLine = currentLine.split("\\|");
                testParams.add(Arguments.of(
                    splittedLine[0],
                    splittedLine[1],
                    parseInt(splittedLine[2]),
                    parseInt(splittedLine[3]),
                    parseInt(splittedLine[4])));
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

        return testParams.stream();
    }

    static boolean isInt(String s) {
        try {
            Integer.parseInt(s);
            return true;
        } catch (NumberFormatException er) {
            return false;
        }
    }

    @BeforeAll
    public static void startTest() {
        var osName = System.getProperty("os.name");
        if (osName.equals("Linux")) {
            System.setProperty("webdriver.chrome.driver", "src/test/chromedriver/chromedriver");
        } else {
            System.setProperty("webdriver.chrome.driver", "src\\test\\chromedriver\\chromedriver.exe");
        }

        ChromeOptions options = new ChromeOptions();
        options.addArguments("start-maximized");
        client1_driver = new ChromeDriver(options);
        client2_driver = new ChromeDriver(options);
        Window client1_window = client1_driver.manage().window();
        Window client2_window = client2_driver.manage().window();
        int breite = client1_window.getSize().getWidth()/2;
        client1_window.setPosition(new Point(0,0));
        client1_window.setSize(new Dimension(breite, client1_window.getSize().getHeight()));
        client2_window.setPosition(new Point(breite, 0));
        client2_window.setSize(new Dimension(breite, client2_window.getSize().getHeight()));
        client1 = new JiffClientTester(client1_driver);
        client2 = new JiffClientTester(client2_driver);

        ExtentHtmlReporter htmlReporter = new ExtentHtmlReporter("./report/testReport.html");
        extent = new ExtentReports();
        extent.attachReporter(htmlReporter);
        printSystemInfo();
        testAccessWebpage();
        testVueJs();
    }

    public static void testAccessWebpage() {
        ExtentTest test = extent.createTest("AccessWebpageTest", "Testen ob Client Webseite geladen werden kann");
        try {
            Assertions.assertTrue(client1.accessWebpage(test));
            Assertions.assertTrue(client2.accessWebpage(test));
        } catch (Exception e) {
            Assertions.fail();
        }
    }

    public static void testVueJs() {
        ExtentTest test = extent.createTest("vueJSTest", "VueJS 3 testen");
        try {
            Assertions.assertTrue(client1.vueJSTest(test));
            Assertions.assertTrue(client2.vueJSTest(test));
        } catch (Exception e) {
            Assertions.fail();
        }
    }

    @AfterEach
    void flush() {
        extent.flush();
    }

    @AfterAll
    public static void endTest() {
        client1_driver.quit();
        client2_driver.quit();
        extent.flush();
    }

    @ParameterizedTest
    @MethodSource("data")
    public void test(String testcaseName, String operation, int inputClient1, int inputClient2, int expectedOutput) throws InterruptedException {
        ExtentTest test = extent.createTest(testcaseName, operation + " von " + inputClient1 + " und " + inputClient2 + " = "+ expectedOutput);
        test.log(Status.INFO, "Test \"" + testcaseName + "\" gestartet");
        try {
            Assertions.assertTrue(client1.jiffEinstellungen(testcaseName, operation, test));
            Assertions.assertTrue(client2.jiffEinstellungen(testcaseName, operation, test));
            Assertions.assertTrue(client1.jiffAllePartiesConnected(test));
            Assertions.assertTrue(client2.jiffAllePartiesConnected(test));
            Assertions.assertTrue(client1.jiffEingaben(inputClient1, test));
            Assertions.assertTrue(client2.jiffEingaben(inputClient2, test));
            Assertions.assertEquals(expectedOutput, client1.jiffGetResult(test));
            Assertions.assertEquals(expectedOutput, client2.jiffGetResult(test));
        } catch (Exception e) {
            test.log(Status.FAIL, "Exception: " + e.getMessage());
            Assertions.fail();
        }
        test.log(Status.INFO, "Test \"" + testcaseName + "\" beendet");
    }

    private static void printSystemInfo(){
        final String osName = System.getProperty("os.name");
        final String osArchitecture = System.getProperty("os.arch");
        final String javaVersion = System.getProperty("java.version");
        extent.setSystemInfo("OS : ", osName);
        extent.setSystemInfo("OS Architecture : ", osArchitecture);
        extent.setSystemInfo("Java Version : ", javaVersion);
    }
}
