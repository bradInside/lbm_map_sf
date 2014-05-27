<?php

namespace Lbm\MapBundle\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class MemberControllerTest extends WebTestCase
{
    public function testAdd()
    {
        $client = static::createClient();

        $crawler = $client->request('GET', '/member/add');
    }

    public function testSearch()
    {
        $client = static::createClient();

        $crawler = $client->request('GET', '/member/search');
    }

}
